import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    // Calculate date ranges for trend comparison
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59,
    );

    const [
      totalUsers,
      totalProducts,
      totalOrders,
      allOrders,
      lowStockProducts,
      usersThisMonth,
      usersLastMonth,
      ordersThisMonth,
      ordersLastMonth,
      productsActive,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.product.count(),
      this.prisma.order.count(),
      this.prisma.order.findMany({
        select: { total: true, createdAt: true, status: true },
      }),
      this.prisma.product.count({
        where: { stock: { lte: 5 } },
      }),
      // Users this month
      this.prisma.user.count({
        where: { createdAt: { gte: startOfThisMonth } },
      }),
      // Users last month
      this.prisma.user.count({
        where: {
          createdAt: {
            gte: startOfLastMonth,
            lte: endOfLastMonth,
          },
        },
      }),
      // Orders this month
      this.prisma.order.count({
        where: { createdAt: { gte: startOfThisMonth } },
      }),
      // Orders last month
      this.prisma.order.count({
        where: {
          createdAt: {
            gte: startOfLastMonth,
            lte: endOfLastMonth,
          },
        },
      }),
      // Active products
      this.prisma.product.count({
        where: { isActive: true },
      }),
    ]);

    // Calculate revenue from paid orders only
    const paidOrders = allOrders.filter(
      (order) => order.status === 'PAID' || order.status === 'PENDING',
    );

    const totalRevenue = paidOrders.reduce(
      (acc, order) => acc + order.total,
      0,
    );

    // Revenue this month
    const revenueThisMonth = allOrders
      .filter(
        (order) =>
          order.createdAt >= startOfThisMonth &&
          (order.status === 'PAID' || order.status === 'PENDING'),
      )
      .reduce((acc, order) => acc + order.total, 0);

    // Revenue last month
    const revenueLastMonth = allOrders
      .filter(
        (order) =>
          order.createdAt >= startOfLastMonth &&
          order.createdAt <= endOfLastMonth &&
          (order.status === 'PAID' || order.status === 'PENDING'),
      )
      .reduce((acc, order) => acc + order.total, 0);

    // Calculate trends (percentage change)
    const calculateTrend = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    const usersTrend = calculateTrend(usersThisMonth, usersLastMonth);
    const ordersTrend = calculateTrend(ordersThisMonth, ordersLastMonth);
    const revenueTrend = calculateTrend(revenueThisMonth, revenueLastMonth);
    const productsTrend = calculateTrend(
      productsActive,
      totalProducts - productsActive,
    );

    // 1. Revenue History (Last 6 months)
    const revenueByMonth = this.getRevenueByMonth(paidOrders);

    // 2. Order Status Distribution
    const orderStatusRaw = await this.prisma.order.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });

    const orderStatusDistribution = orderStatusRaw.map((item) => ({
      name: item.status,
      value: item._count.status,
    }));

    // 3. Recent Orders
    const recentOrders = await this.prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    // 4. Top Selling Products
    const topSellingItems = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 4,
    });

    const topProducts = await Promise.all(
      topSellingItems.map(async (item) => {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            id: true,
            name: true,
            price: true,
            image_url: true,
            category: true,
          },
        });
        return {
          ...product,
          sold: item._sum.quantity || 0,
        };
      }),
    );

    return {
      // Current totals
      users: totalUsers,
      products: productsActive,
      orders: totalOrders,
      revenue: totalRevenue,

      // Additional metrics
      lowStockProducts,
      totalProducts,

      // Trends (month over month)
      trends: {
        users: {
          value: usersTrend,
          isPositive: usersTrend >= 0,
        },
        orders: {
          value: ordersTrend,
          isPositive: ordersTrend >= 0,
        },
        revenue: {
          value: revenueTrend,
          isPositive: revenueTrend >= 0,
        },
        products: {
          value: productsTrend,
          isPositive: productsTrend >= 0,
        },
      },

      // Charts data
      revenueByMonth,
      orderStatusDistribution,
      recentOrders,
      topProducts,
    };
  }

  private getRevenueByMonth(orders: { total: number; createdAt: Date }[]) {
    const months = [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic',
    ];

    interface MonthData {
      month: string;
      year: number;
      revenue: number;
      rawDate: Date;
    }

    const currentDate = new Date();
    const last6Months: MonthData[] = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1,
      );
      last6Months.push({
        month: months[d.getMonth()],
        year: d.getFullYear(),
        revenue: 0,
        rawDate: d,
      });
    }

    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      const monthEntry = last6Months.find(
        (m) =>
          m.rawDate.getMonth() === orderDate.getMonth() &&
          m.rawDate.getFullYear() === orderDate.getFullYear(),
      );
      if (monthEntry) {
        monthEntry.revenue += order.total;
      }
    });

    return last6Months.map(({ month, revenue }) => ({
      name: month,
      total: revenue,
    }));
  }
}
