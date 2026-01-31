import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PhoneVerificationStatus } from '@prisma/client';

@Injectable()
export class PhoneVerificationService {
  constructor(private prisma: PrismaService) {}

  // 6자리 랜덤 숫자 생성
  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // 인증 코드 발송 (DB 저장 + SMS 발송 시뮬레이션)
  async sendCode(phone: string): Promise<void> {
    const code = this.generateCode();
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000); // 3분 후 만료

    console.log(`[DEBUG] sendCode called for phone: ${phone}, code: ${code}`);

    try {
      const result = await this.prisma.phoneVerification.create({
        data: {
          phone,
          code,
          expiresAt,
          status: PhoneVerificationStatus.PENDING,
        },
      });
      console.log(`[DEBUG] Saved to DB:`, result);

      // TODO: 실제 SMS 발송 로직 연동 (e.g. solapi, twilio, aligo)
      console.log(`[SMS] To: ${phone}, Code: ${code}`);
    } catch (error) {
      console.error('Failed to save verification code:', error);
      throw new InternalServerErrorException(
        'Failed to send verification code',
      );
    }
  }

  // 인증 코드 검증
  async verifyCode(phone: string, code: string): Promise<boolean> {
    console.log(`[DEBUG] verifyCode called for phone: ${phone}, code: ${code}`);

    // 해당 번호의 유효한(PENDING 상태이고 만료되지 않은) 최신 인증 요청 조회
    const verification = await this.prisma.phoneVerification.findFirst({
      where: {
        phone,
        status: PhoneVerificationStatus.PENDING,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    console.log(`[DEBUG] Verification found in DB:`, verification);

    if (!verification) {
      throw new NotFoundException('Verification code expired or not found');
    }

    // 시도 횟수 제한 확인 (5회)
    if (verification.attempts >= 5) {
      await this.prisma.phoneVerification.update({
        where: { id: verification.id },
        data: { status: PhoneVerificationStatus.EXPIRED },
      });
      throw new BadRequestException(
        'Too many failed attempts. Please request a new code.',
      );
    }

    // 코드 일치 여부 확인
    if (verification.code !== code) {
      // 시도 횟수 증가
      await this.prisma.phoneVerification.update({
        where: { id: verification.id },
        data: { attempts: { increment: 1 } },
      });
      throw new BadRequestException('Invalid verification code');
    }

    // 인증 성공 처리
    await this.prisma.phoneVerification.update({
      where: { id: verification.id },
      data: {
        status: PhoneVerificationStatus.VERIFIED,
        verifiedAt: new Date(),
      },
    });

    return true;
  }
}
