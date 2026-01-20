import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Injectable()
export class BannersService {
  constructor(private prisma: PrismaService) {}

  async create(createBannerDto: CreateBannerDto) {
    // Get the highest position
    const maxPosition = await this.prisma.banner.findFirst({
      orderBy: { position: 'desc' },
      select: { position: true },
    });

    const position =
      createBannerDto.position ?? (maxPosition?.position ?? 0) + 1;

    return this.prisma.banner.create({
      data: {
        ...createBannerDto,
        position,
      },
    });
  }

  async findAll(activeOnly = false) {
    const now = new Date();
    const where = activeOnly
      ? {
          isActive: true,
          OR: [{ startsAt: null }, { startsAt: { lte: now } }],
          AND: [
            {
              OR: [{ endsAt: null }, { endsAt: { gte: now } }],
            },
          ],
        }
      : {};

    return this.prisma.banner.findMany({
      where,
      orderBy: { position: 'asc' },
    });
  }

  async findOne(id: string) {
    const banner = await this.prisma.banner.findUnique({
      where: { id },
    });

    if (!banner) {
      throw new NotFoundException('Banner no encontrado');
    }

    return banner;
  }

  async update(id: string, updateBannerDto: UpdateBannerDto) {
    await this.findOne(id); // Verify exists

    return this.prisma.banner.update({
      where: { id },
      data: updateBannerDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Verify exists

    return this.prisma.banner.delete({
      where: { id },
    });
  }

  async reorder(bannerId: string, newPosition: number) {
    const banner = await this.findOne(bannerId);
    const oldPosition = banner.position;

    if (oldPosition === newPosition) {
      return banner;
    }

    // Update positions of affected banners
    if (newPosition > oldPosition) {
      // Moving down: shift banners between old and new position up
      await this.prisma.banner.updateMany({
        where: {
          position: {
            gt: oldPosition,
            lte: newPosition,
          },
        },
        data: {
          position: {
            decrement: 1,
          },
        },
      });
    } else {
      // Moving up: shift banners between new and old position down
      await this.prisma.banner.updateMany({
        where: {
          position: {
            gte: newPosition,
            lt: oldPosition,
          },
        },
        data: {
          position: {
            increment: 1,
          },
        },
      });
    }

    // Update the banner's position
    return this.prisma.banner.update({
      where: { id: bannerId },
      data: { position: newPosition },
    });
  }
}
