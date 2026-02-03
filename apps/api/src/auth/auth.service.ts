import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<import('@prisma/client').User, 'password'> | null> {
    const user = await this.usersService.findOne(email);
    if (user && user.password && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: import('@prisma/client').User) {
    const payload = { username: user.email, sub: user.id };
    return Promise.resolve({
      access_token: this.jwtService.sign(payload),
      user,
    });
  }

  async register(data: {
    phone: string;
    email?: string;
    password?: string;
    name: string;
    birthYear: number;
    gender: string;
    locMain: { name: string };
    locSub: { name: string };
    intro?: string;
    hobbies?: string[];
    meetingType?: string;
    profileImage?: string;
    kakaoId?: string;
  }) {
    // Check if user exists by phone
    const existingUser = await this.usersService.findOneByPhone(data.phone);
    if (existingUser) {
      throw new ConflictException('Phone number already exists');
    }

    // Check if user exists by email
    if (data.email) {
      const existingUserByEmail = await this.usersService.findOne(data.email);
      if (existingUserByEmail) {
        throw new ConflictException('Email already exists');
      }
    }

    const hashedPassword = data.password
      ? await bcrypt.hash(data.password, 10)
      : undefined;

    const user = await this.usersService.create({
      phone: data.phone,
      email: data.email,
      password: hashedPassword,
      kakaoId: data.kakaoId,
      role: 'USER',
      profile: {
        create: {
          name: data.name,
          birthYear: data.birthYear,
          gender: data.gender.toUpperCase() as import('@prisma/client').Gender,
          location: `${data.locMain.name} ${data.locSub.name}`,
          bio: data.intro,
          interests: data.hobbies,
          meetingType: data.meetingType,
          images: data.profileImage ? [data.profileImage] : [],
        },
      },
    });

    const payload = { username: user.id, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async changePassword(
    data: import('./dto/change-password.dto').ChangePasswordDto,
  ) {
    const user = await this.usersService.findById(data.userId);
    if (!user || !user.password) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(data.currentPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Current password does not match');
    }

    const hashedNewPassword = await bcrypt.hash(data.newPassword, 10);
    return this.usersService.updatePassword(data.userId, hashedNewPassword);
  }

  async loginWithKakao(kakaoUser: any) {
    const { id, kakao_account } = kakaoUser;
    const email = kakao_account?.email;
    const kakaoId = id.toString();

    // Check if user exists by kakaoId
    let user = await this.usersService.findOneByKakaoId(kakaoId);

    // If not found by kakaoId, try finding by email (if exists) and link it
    if (!user && email) {
      user = await this.usersService.findOne(email);
      // If found by email, we could potentially link kakaoId here, 
      // but simpler for now is to treat as 'registered' and return login
      // However, linking is better. For now, let's just return if user exists.
    }

    if (user) {
      // User exists, log them in
      const payload = { username: user.id, sub: user.id };
      return {
        isRegistered: true,
        access_token: this.jwtService.sign(payload),
        user,
      };
    }

    // User does not exist, return info for registration
    return {
      isRegistered: false,
      kakaoId,
      email,
      name: kakao_account?.profile?.nickname,
      profileImage: kakao_account?.profile?.profile_image_url,
    };
  }
}
