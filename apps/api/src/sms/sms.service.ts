import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { SolapiMessageService } from 'solapi';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly messageService: SolapiMessageService;
  private readonly senderNumber: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const apiKey = this.configService.get<string>('SMS_API_KEY') || '';
    const apiSecret = this.configService.get<string>('SMS_API_SECRET') || '';
    this.senderNumber =
      this.configService.get<string>('SMS_SENDER_NUMBER') || '';

    if (!apiKey || !apiSecret) {
      this.logger.warn(
        'SMS_API_KEY or SMS_API_SECRET not set. SMS sending will fail.',
      );
    }

    this.messageService = new SolapiMessageService(apiKey, apiSecret);
  }

  async sendSms(to: string, content: string): Promise<boolean> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Check daily limit
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const count = await (this.prisma as any).smsLog.count({
      where: {
        to,
        createdAt: {
          gte: today,
        },
        status: 'SUCCESS',
      },
    });

    if (count >= 3) {
      this.logger.warn(`Daily SMS limit exceeded for ${to}`);
      return false;
    }

    // 2. Send SMS
    let status = 'FAILURE';
    let messageId: string | null = null;
    let resultCode: string | null = null;

    if (!this.senderNumber) {
      this.logger.error('SMS_SENDER_NUMBER is not set');
      return false;
    }

    try {
      const result = await this.messageService.sendOne({
        to,
        from: this.senderNumber,
        text: content,
      });

      // Check result
      messageId = result.messageId;
      resultCode = result.statusCode;

      if (messageId) {
        status = 'SUCCESS';
      }

      this.logger.log(`SMS sent to ${to}: ${messageId}`);
      return true;
    } catch (error: any) {
      this.logger.error(`Failed to send SMS to ${to}`, error);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      resultCode = error.message || 'Unknown Error';
      return false;
    } finally {
      // 3. Log to database
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      await (this.prisma as any).smsLog.create({
        data: {
          to,
          from: this.senderNumber,
          content,
          status,
          messageId,
          resultCode: resultCode ? String(resultCode) : null,
        },
      });
    }
  }
}
