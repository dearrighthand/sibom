import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendPasswordResetEmail(to: string, token: string) {
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${token}`;

    // Log the link for development convenience
    this.logger.log(`Password reset link generated for ${to}: ${resetLink}`);

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      this.logger.warn(
        'SMTP credentials not configured. Skipping actual email delivery.',
      );
      return;
    }

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || '"SIBOM" <noreply@sibom.com>',
        to,
        subject: '[SIBOM] 비밀번호 재설정 안내',
        text: `비밀번호를 재설정하려면 다음 링크를 클릭하세요: ${resetLink}\n이 링크는 1시간 후 만료됩니다.`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>비밀번호 재설정 안내</h2>
            <p>안녕하세요,</p>
            <p>SIBOM 계정의 비밀번호 재설정을 요청하셨습니다. 아래 버튼을 클릭하여 새 비밀번호를 설정해주세요.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background-color: #FF8B7D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">비밀번호 재설정하기</a>
            </div>
            <p>버튼이 작동하지 않는 경우 아래 링크를 주소창에 복사해서 붙여넣으세요:</p>
            <p><a href="${resetLink}">${resetLink}</a></p>
            <p>이 링크는 1시간 후 만료됩니다. 본인이 요청하지 않으셨다면 이 이메일을 무시해주세요.</p>
          </div>
        `,
      });
      this.logger.log(`Password reset email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${to}:`, error);
      throw error;
    }
  }
}
