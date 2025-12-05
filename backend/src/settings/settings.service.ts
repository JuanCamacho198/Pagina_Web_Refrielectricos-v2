import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

const DEFAULT_SETTINGS_ID = 'store-settings';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings() {
    // Try to find existing settings, or create default ones
    let settings = await this.prisma.storeSettings.findUnique({
      where: { id: DEFAULT_SETTINGS_ID },
    });

    if (!settings) {
      settings = await this.prisma.storeSettings.create({
        data: { id: DEFAULT_SETTINGS_ID },
      });
    }

    return settings;
  }

  async updateSettings(dto: UpdateSettingsDto) {
    // Upsert to handle the case where settings don't exist yet
    return this.prisma.storeSettings.upsert({
      where: { id: DEFAULT_SETTINGS_ID },
      update: dto,
      create: {
        id: DEFAULT_SETTINGS_ID,
        ...dto,
      },
    });
  }
}
