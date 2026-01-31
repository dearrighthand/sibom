import {
  Injectable,
  UnauthorizedException,
  ConflictException,
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

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && user.password && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(data: any) {
    // data structure expected:
    // { phone, name, birthYear, gender, location, intro, hobbies, meetingType, profileImage }

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
      email: data.email, // Add email
      password: hashedPassword, // Add hashed password
      role: 'USER',
      profile: {
        create: {
          name: data.name,
          birthYear: data.birthYear,
          gender: data.gender?.toUpperCase(),
          location: `${data.locMain?.name} ${data.locSub?.name}`,
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
