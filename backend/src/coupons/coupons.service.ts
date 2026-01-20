import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCouponDto, DiscountType } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { ValidateCouponDto } from './dto/validate-coupon.dto';

@Injectable()
export class CouponsService {
  constructor(private prisma: PrismaService) {}

  async create(createCouponDto: CreateCouponDto, userId?: string) {
    // Check if code already exists
    const existingCoupon = await this.prisma.coupon.findUnique({
      where: { code: createCouponDto.code.toUpperCase() },
    });

    if (existingCoupon) {
      throw new ConflictException('El código de cupón ya existe');
    }

    // Validate discount value based on type
    if (
      createCouponDto.discountType === DiscountType.PERCENTAGE &&
      createCouponDto.discountValue > 100
    ) {
      throw new BadRequestException(
        'El descuento porcentual no puede ser mayor al 100%',
      );
    }

    if (
      createCouponDto.discountType === DiscountType.PERCENTAGE &&
      createCouponDto.discountValue <= 0
    ) {
      throw new BadRequestException(
        'El valor del descuento debe ser mayor a 0',
      );
    }

    return this.prisma.coupon.create({
      data: {
        ...createCouponDto,
        code: createCouponDto.code.toUpperCase(),
        createdBy: userId,
      },
    });
  }

  async findAll(includeInactive = false) {
    const where = includeInactive ? {} : { isActive: true };

    return this.prisma.coupon.findMany({
      where,
      include: {
        _count: {
          select: { usages: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id },
      include: {
        usages: {
          take: 10,
          orderBy: { usedAt: 'desc' },
        },
        _count: {
          select: { usages: true },
        },
      },
    });

    if (!coupon) {
      throw new NotFoundException('Cupón no encontrado');
    }

    return coupon;
  }

  async findByCode(code: string) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      throw new NotFoundException('Cupón no encontrado');
    }

    return coupon;
  }

  async update(id: string, updateCouponDto: UpdateCouponDto) {
    await this.findOne(id); // Verify exists

    if (updateCouponDto.code) {
      const existingCoupon = await this.prisma.coupon.findUnique({
        where: { code: updateCouponDto.code.toUpperCase() },
      });

      if (existingCoupon && existingCoupon.id !== id) {
        throw new ConflictException('El código de cupón ya existe');
      }
    }

    return this.prisma.coupon.update({
      where: { id },
      data: {
        ...updateCouponDto,
        code: updateCouponDto.code?.toUpperCase(),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Verify exists

    return this.prisma.coupon.delete({
      where: { id },
    });
  }

  async validateCoupon(validateCouponDto: ValidateCouponDto) {
    const { code, cartTotal } = validateCouponDto;

    const coupon = await this.prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      throw new NotFoundException('Cupón no encontrado');
    }

    if (!coupon.isActive) {
      throw new BadRequestException('Este cupón no está activo');
    }

    const now = new Date();

    // Check start date
    if (coupon.startsAt && now < coupon.startsAt) {
      throw new BadRequestException('Este cupón aún no está disponible');
    }

    // Check expiration
    if (coupon.expiresAt && now > coupon.expiresAt) {
      throw new BadRequestException('Este cupón ha expirado');
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      throw new BadRequestException('Este cupón ha alcanzado su límite de uso');
    }

    // Check minimum purchase
    if (coupon.minPurchaseAmount && cartTotal < coupon.minPurchaseAmount) {
      throw new BadRequestException(
        `Compra mínima de $${coupon.minPurchaseAmount.toLocaleString()} requerida para usar este cupón`,
      );
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = (cartTotal * coupon.discountValue) / 100;
    } else {
      discountAmount = coupon.discountValue;
    }

    // Apply max discount if set
    if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
      discountAmount = coupon.maxDiscountAmount;
    }

    // Ensure discount doesn't exceed cart total
    if (discountAmount > cartTotal) {
      discountAmount = cartTotal;
    }

    return {
      valid: true,
      couponId: coupon.id,
      code: coupon.code,
      discountAmount: Math.round(discountAmount),
      finalTotal: Math.round(cartTotal - discountAmount),
    };
  }

  async applyCoupon(couponId: string, userId: string, orderId?: string) {
    // Increment usage count
    await this.prisma.coupon.update({
      where: { id: couponId },
      data: { usageCount: { increment: 1 } },
    });

    // Record usage
    return this.prisma.couponUsage.create({
      data: {
        couponId,
        userId,
        orderId,
      },
    });
  }

  async getStats() {
    const totalCoupons = await this.prisma.coupon.count();
    const activeCoupons = await this.prisma.coupon.count({
      where: { isActive: true },
    });
    const totalUsages = await this.prisma.couponUsage.count();

    const topCoupons = await this.prisma.coupon.findMany({
      take: 5,
      orderBy: { usageCount: 'desc' },
      select: {
        code: true,
        usageCount: true,
        discountType: true,
        discountValue: true,
      },
    });

    return {
      totalCoupons,
      activeCoupons,
      totalUsages,
      topCoupons,
    };
  }
}
