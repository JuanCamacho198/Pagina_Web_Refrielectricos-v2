import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const [totalUsers, totalProducts, totalOrders, paidOrders, lowStockProducts] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.product.count(),
        this.prisma.order.count(),
        this.prisma.order.findMany({
          where: { status: 'PAID' },
          select: { total: true },
        }),
        this.prisma.product.count({
          where: { stock: { lte: 5 } },
        }),
      ]);

    const totalRevenue = paidOrders.reduce((acc, order) => acc + order.total, 0);

    return {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      lowStockProducts,
    };
  }
}
