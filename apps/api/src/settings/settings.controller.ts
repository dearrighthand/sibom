import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { UsersService } from '../users/users.service';

@Controller('settings')
export class SettingsController {
  constructor(
    private readonly settingsService: SettingsService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  async getSettings(@Query('userId') userId: string) {
    if (!userId) throw new UnauthorizedException('User ID is required');
    return this.settingsService.getSettings(userId);
  }

  @Patch()
  async updateSettings(
    @Query('userId') userId: string,
    @Body() updateSettingsDto: UpdateSettingsDto,
  ) {
    if (!userId) throw new UnauthorizedException('User ID is required');
    return this.settingsService.updateSettings(userId, updateSettingsDto);
  }

  @Delete('account')
  async deleteAccount(@Query('userId') userId: string) {
    if (!userId) throw new UnauthorizedException('User ID is required');
    return this.usersService.delete(userId);
  }
}
