import { Injectable, ConflictException } from '@nestjs/common';
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
}
