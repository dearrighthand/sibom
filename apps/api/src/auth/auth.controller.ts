import {
  Controller,
  Post,
  Patch,
  Body,
  ConflictException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { PhoneVerificationService } from './phone-verification.service';
import { SendVerificationCodeDto } from './dto/send-verification-code.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { CheckEmailDto } from './dto/check-email.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private phoneVerificationService: PhoneVerificationService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() req: { email: string; password: string }) {
    // In a real app, use LocalAuthGuard. Here assuming `req` contains email/password
    // But wait, `login` service expects a user object (result of validation).
    // Let's assume validation happens here for simplicity or use a Guard.
    // For proper pattern:
    const user = await this.authService.validateUser(req.email, req.password);
    if (!user) {
      return { message: 'Invalid credentials' }; // Or throw Unauthorized
    }
    return this.authService.login(user as import('@prisma/client').User);
  }

  @Post('register')
  async register(
    @Body() createUserDto: Parameters<AuthService['register']>[0],
  ) {
    return this.authService.register(createUserDto);
  }

  @Post('phone/send')
  async sendVerificationCode(
    @Body() sendVerificationCodeDto: SendVerificationCodeDto,
  ) {
    const existingUser = await this.usersService.findOneByPhone(
      sendVerificationCodeDto.phone,
    );
    if (existingUser) {
      throw new ConflictException('Phone number already in use');
    }
    await this.phoneVerificationService.sendCode(sendVerificationCodeDto.phone);
    return { message: 'Verification code sent' };
  }

  @Post('email/check')
  async checkEmail(@Body() checkEmailDto: CheckEmailDto) {
    const user = await this.usersService.findOne(checkEmailDto.email);
    return { exists: !!user };
  }

  @Post('phone/verify')
  async verifyCode(@Body() verifyCodeDto: VerifyCodeDto) {
    const isVerified = await this.phoneVerificationService.verifyCode(
      verifyCodeDto.phone,
      verifyCodeDto.code,
    );
    return { verified: isVerified };
  }

  @Patch('password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    await this.authService.changePassword(changePasswordDto);
    return { message: 'Password changed successfully' };
  }

  // Example protected route
  // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // getProfile(@Request() req) {
  //   return req.user;
  // }
}
