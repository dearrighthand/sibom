import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSettings(userId: string) {
    let settings = await this.prisma.setting.findUnique({
      where: { userId },
    });

    if (!settings) {
      // Lazy initialize settings if they don't exist
      settings = await this.prisma.setting.create({
        data: {
          userId,
        },
      });
    }

    return settings;
  }

  async updateSettings(userId: string, updateSettingsDto: UpdateSettingsDto) {
    // Ensure settings exist before update
    await this.getSettings(userId);

    return this.prisma.setting.update({
      where: { userId },
      data: updateSettingsDto,
    });
  }
}
