import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createAddressDto: CreateAddressDto) {
    // Si esta dirección es marcada como default, desmarcar las otras
    if (createAddressDto.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    // Si es la primera dirección, hacerla default automáticamente
    const count = await this.prisma.address.count({ where: { userId } });
    const isDefault = count === 0 ? true : createAddressDto.isDefault;

    return await this.prisma.address.create({
      data: {
        ...createAddressDto,
        userId,
        isDefault,
      },
    });
  }

  async findAll(userId: string) {
    return await this.prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' }, // Default primero
    });
  }

  async findOne(id: string, userId: string) {
    const address = await this.prisma.address.findUnique({
      where: { id },
    });

    if (!address || address.userId !== userId) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }

    return address;
  }

  async update(id: string, userId: string, updateAddressDto: UpdateAddressDto) {
    await this.findOne(id, userId); // Verificar propiedad

    if (updateAddressDto.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return await this.prisma.address.update({
      where: { id },
      data: updateAddressDto,
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId); // Verificar propiedad
    return await this.prisma.address.delete({
      where: { id },
    });
  }
}
