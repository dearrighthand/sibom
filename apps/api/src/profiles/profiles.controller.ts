import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/create-profile.dto';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get(':userId')
  async findOne(@Param('userId') userId: string) {
    const profile = await this.profilesService.findOne(userId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  @Patch(':userId')
  async update(
    @Param('userId') userId: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profilesService.update(userId, updateProfileDto);
  }
}
