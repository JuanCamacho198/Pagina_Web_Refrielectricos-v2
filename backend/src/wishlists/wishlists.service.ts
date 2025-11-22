import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createWishlistDto: CreateWishlistDto) {
    // Verificar si ya existe una lista con ese nombre para el usuario
    const existing = await this.prisma.wishlist.findUnique({
      where: {
        userId_name: {
          userId,
          name: createWishlistDto.name,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Ya tienes una lista con este nombre');
    }

    return this.prisma.wishlist.create({
      data: {
        userId,
        name: createWishlistDto.name,
      },
      include: {
        items: true,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.wishlist.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const wishlist = await this.prisma.wishlist.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!wishlist) throw new NotFoundException('Lista no encontrada');
    if (wishlist.userId !== userId) {
      throw new ForbiddenException('No tienes acceso a esta lista');
    }

    return wishlist;
  }

  async addItem(userId: string, wishlistId: string, productId: string) {
    // Verificar propiedad de la lista
    await this.findOne(userId, wishlistId);

    // Verificar existencia del producto
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Producto no encontrado');

    try {
      return await this.prisma.wishlistItem.create({
        data: {
          wishlistId,
          productId,
        },
        include: {
          product: true,
        },
      });
    } catch (error) {
      // Prisma error P2002: Unique constraint failed
      if ((error as { code: string }).code === 'P2002') {
        throw new ConflictException('El producto ya está en esta lista');
      }
      throw error;
    }
  }

  async removeItem(userId: string, wishlistId: string, productId: string) {
    await this.findOne(userId, wishlistId);

    // Buscar el item específico
    const item = await this.prisma.wishlistItem.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId,
          productId,
        },
      },
    });

    if (!item) throw new NotFoundException('El producto no está en la lista');

    return this.prisma.wishlistItem.delete({
      where: {
        id: item.id,
      },
    });
  }

  async remove(userId: string, id: string) {
    const wishlist = await this.findOne(userId, id);
    
    if (wishlist.name === 'Favoritos') {
      throw new BadRequestException('No se puede eliminar la lista de favoritos por defecto');
    }

    return this.prisma.wishlist.delete({ where: { id } });
  }
}
