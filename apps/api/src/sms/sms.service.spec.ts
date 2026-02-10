
import { Test, TestingModule } from '@nestjs/testing';
import { SmsService } from './sms.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { SolapiMessageService } from 'solapi';

// Mock SolapiMessageService
jest.mock('solapi', () => {
  return {
    SolapiMessageService: jest.fn().mockImplementation(() => ({
      sendOne: jest.fn().mockResolvedValue({
        messageId: 'mock-message-id',
        statusCode: '2000',
      }),
    })),
  };
});

describe('SmsService', () => {
  let service: SmsService;
  let prismaService: PrismaService;
  let configService: ConfigService;

  const mockPrismaService = {
    smsLog: {
      count: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'SMS_API_KEY') return 'mock-key';
      if (key === 'SMS_API_SECRET') return 'mock-secret';
      if (key === 'SMS_SENDER_NUMBER') return '01012345678';
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SmsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<SmsService>(SmsService);
    prismaService = module.get<PrismaService>(PrismaService);
    configService = module.get<ConfigService>(ConfigService);
    
    // Clear mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendSms', () => {
    it('should send SMS if under daily limit', async () => {
      // Mock daily limit check -> 0 count
      (mockPrismaService.smsLog.count as jest.Mock).mockResolvedValue(0);

      const result = await service.sendSms('01000000000', 'Test message');

      expect(result).toBe(true);
      expect(mockPrismaService.smsLog.count).toHaveBeenCalled();
      // Verify Solapi called (implicitly via success result)
      expect(mockPrismaService.smsLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            to: '01000000000',
            status: 'SUCCESS',
            messageId: 'mock-message-id',
          }),
        }),
      );
    });

    it('should not send SMS if daily limit reached', async () => {
      // Mock daily limit check -> 3 count
      (mockPrismaService.smsLog.count as jest.Mock).mockResolvedValue(3);

      const result = await service.sendSms('01000000000', 'Test message');

      expect(result).toBe(false);
      expect(mockPrismaService.smsLog.count).toHaveBeenCalled();
      // Verify create not called (or Solapi not called)
      expect(mockPrismaService.smsLog.create).not.toHaveBeenCalled();
    });
  });
});
