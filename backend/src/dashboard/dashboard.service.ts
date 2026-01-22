import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface DashboardFilters {
  period?: 'day' | 'week' | 'month' | 'quarter' | 'year';
  startDate?: Date;
  endDate?: Date;
  compare?: boolean;
}

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(filters: DashboardFilters = {}) {
    const { period = 'month', startDate, endDate } = filters;

    // Calculate date ranges
    const dateRanges = this.calculateDateRanges(period, startDate, endDate);
    const { currentStart, currentEnd, previousStart, previousEnd } = dateRanges;

    // Parallel queries for performance
    const [
      // Basic counts
      totalUsers,
      totalProducts,
      totalOrders,
      allOrders,

      // Stock alerts
      criticalStock,
      lowStockProducts,

      // Time-based data
      usersInPeriod,
      usersPrevPeriod,
      ordersInPeriod,
      ordersPrevPeriod,
      productsActive,

      // Advanced metrics
      totalViews,
      viewsWithoutPurchase,
      ordersByPaymentMethod,
      ordersByCategory,
      pendingOrders,
      unprocessedOrders,
      newUsersToday,
      salesByHour,
    ] = await Promise.all([
      // Basic counts
      this.prisma.user.count(),
      this.prisma.product.count(),
      this.prisma.order.count(),
      this.prisma.order.findMany({
        select: {
          total: true,
          createdAt: true,
          status: true,
          paymentMethod: true,
          items: {
            include: {
              product: {
                select: { category: true },
              },
            },
          },
        },
      }),

      // Stock alerts
      this.prisma.product.count({
        where: { stock: { lte: 2 } },
      }),
      this.prisma.product.count({
        where: { stock: { lte: 5 } },
      }),

      // Users in current period
      this.prisma.user.count({
        where: { createdAt: { gte: currentStart, lte: currentEnd } },
      }),
      // Users in previous period
      this.prisma.user.count({
        where: {
          createdAt: {
            gte: previousStart,
            lte: previousEnd,
          },
        },
      }),
      // Orders in current period
      this.prisma.order.count({
        where: { createdAt: { gte: currentStart, lte: currentEnd } },
      }),
      // Orders in previous period
      this.prisma.order.count({
        where: {
          createdAt: {
            gte: previousStart,
            lte: previousEnd,
          },
        },
      }),
      // Active products
      this.prisma.product.count({
        where: { isActive: true },
      }),

      // Total product views
      this.prisma.productView.count(),

      // Views without purchase (products viewed but never bought)
      this.getViewsWithoutPurchase(),

      // Orders grouped by payment method
      this.prisma.order.groupBy({
        by: ['paymentMethod'],
        where: {
          status: { in: ['PAID', 'PENDING'] },
          paymentMethod: { not: null },
        },
        _count: {
          paymentMethod: true,
        },
      }),

      // Top categories
      this.getTopCategories(currentStart, currentEnd),

      // Pending orders
      this.prisma.order.count({
        where: { status: 'PENDING' },
      }),

      // Unprocessed orders (pending > 24h)
      this.prisma.order.count({
        where: {
          status: 'PENDING',
          createdAt: {
            lte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      }),

      // New users today
      this.prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),

      // Sales by hour
      this.getSalesByHour(currentStart, currentEnd),
    ]);

    // Calculate revenue from paid orders
    const paidOrders = allOrders.filter(
      (order) => order.status === 'PAID' || order.status === 'PENDING',
    );

    const totalRevenue = paidOrders.reduce(
      (acc, order) => acc + order.total,
      0,
    );

    // Revenue in current period
    const revenueInPeriod = allOrders
      .filter(
        (order) =>
          order.createdAt >= currentStart &&
          order.createdAt <= currentEnd &&
          (order.status === 'PAID' || order.status === 'PENDING'),
      )
      .reduce((acc, order) => acc + order.total, 0);

    // Revenue in previous period
    const revenuePrevPeriod = allOrders
      .filter(
        (order) =>
          order.createdAt >= previousStart &&
          order.createdAt <= previousEnd &&
          (order.status === 'PAID' || order.status === 'PENDING'),
      )
      .reduce((acc, order) => acc + order.total, 0);

    // Calculate conversion rate
    const conversionRate =
      totalViews > 0 ? (totalOrders / totalViews) * 100 : 0;

    // Calculate trends
    const usersTrend = this.calculateTrend(usersInPeriod, usersPrevPeriod);
    const ordersTrend = this.calculateTrend(ordersInPeriod, ordersPrevPeriod);
    const revenueTrend = this.calculateTrend(
      revenueInPeriod,
      revenuePrevPeriod,
    );
    const productsTrend = this.calculateTrend(
      productsActive,
      totalProducts - productsActive,
    );

    // Revenue history
    const revenueByMonth = this.getRevenueByMonth(paidOrders);

    // Order status distribution
    const orderStatusRaw = await this.prisma.order.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    const orderStatusDistribution = orderStatusRaw.map((item) => ({
      name: item.status,
      value: item._count.status,
    }));

    // Recent orders
    const recentOrders = await this.prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    // Top selling products
    const topSellingItems = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
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

    // Average order value
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Payment methods formatted
    const paymentMethods = ordersByPaymentMethod.map((pm) => ({
      method: pm.paymentMethod || 'Desconocido',
      count: pm._count.paymentMethod,
      percentage:
        totalOrders > 0
          ? ((pm._count.paymentMethod / totalOrders) * 100).toFixed(1)
          : '0',
    }));

    return {
      // Current totals
      users: totalUsers,
      products: productsActive,
      orders: totalOrders,
      revenue: totalRevenue,

      // Additional metrics
      lowStockProducts,
      criticalStockProducts: criticalStock,
      totalProducts,
      pendingOrders,
      unprocessedOrders,
      newUsersToday,
      conversionRate: Number(conversionRate.toFixed(2)),
      averageOrderValue: Number(averageOrderValue.toFixed(2)),
      totalViews,

      // Trends (period over period)
      trends: {
        users: {
          value: usersTrend,
          isPositive: usersTrend >= 0,
          current: usersInPeriod,
          previous: usersPrevPeriod,
        },
        orders: {
          value: ordersTrend,
          isPositive: ordersTrend >= 0,
          current: ordersInPeriod,
          previous: ordersPrevPeriod,
        },
        revenue: {
          value: revenueTrend,
          isPositive: revenueTrend >= 0,
          current: revenueInPeriod,
          previous: revenuePrevPeriod,
        },
        products: {
          value: productsTrend,
          isPositive: productsTrend >= 0,
          current: productsActive,
          previous: totalProducts - productsActive,
        },
      },

      // Payment methods
      paymentMethods,

      // Top categories
      topCategories: ordersByCategory,

      // Most viewed without purchase
      viewsWithoutPurchase: viewsWithoutPurchase.slice(0, 5),

      // Sales by hour heatmap
      salesByHour,

      // Charts data
      revenueByMonth,
      orderStatusDistribution,
      recentOrders,
      topProducts,

      // Period info
      periodInfo: {
        period,
        currentStart,
        currentEnd,
        previousStart,
        previousEnd,
      },
    };
  }

  async getNotifications() {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [criticalStockProducts, unprocessedOrders, newUsersToday] =
      await Promise.all([
        // Critical stock (≤ 2 units)
        this.prisma.product.findMany({
          where: { stock: { lte: 2 } },
          select: { id: true, name: true, stock: true },
          take: 10,
        }),

        // Orders pending > 24h
        this.prisma.order.findMany({
          where: {
            status: 'PENDING',
            createdAt: { lte: yesterday },
          },
          select: {
            id: true,
            total: true,
            createdAt: true,
            user: {
              select: { name: true, email: true },
            },
          },
          take: 10,
        }),

        // New users today
        this.prisma.user.findMany({
          where: {
            createdAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
          },
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        }),
      ]);

    return {
      criticalStock: criticalStockProducts.map((p) => ({
        type: 'CRITICAL_STOCK',
        severity: 'high',
        title: `⚠️ Stock crítico: ${p.name}`,
        message: `Solo quedan ${p.stock} unidad${p.stock !== 1 ? 'es' : ''}`,
        productId: p.id,
        productName: p.name,
        stock: p.stock,
      })),

      unprocessedOrders: unprocessedOrders.map((o) => ({
        type: 'UNPROCESSED_ORDER',
        severity: 'medium',
        title: '📦 Pedido sin procesar',
        message: `Pedido #${o.id.slice(-8)} lleva ${this.getHoursSince(o.createdAt)}h sin procesar`,
        orderId: o.id,
        orderTotal: o.total,
        customerName: o.user.name,
        createdAt: o.createdAt,
      })),

      newUsers: newUsersToday.map((u) => ({
        type: 'NEW_USER',
        severity: 'info',
        title: '👥 Nuevo usuario registrado',
        message: `${u.name} se registró`,
        userId: u.id,
        userName: u.name,
        userEmail: u.email,
        createdAt: u.createdAt,
      })),
    };
  }

  private calculateDateRanges(
    period: string,
    customStart?: Date,
    customEnd?: Date,
  ) {
    const now = new Date();
    let currentStart: Date;
    let currentEnd: Date = customEnd || now;
    let previousStart: Date;
    let previousEnd: Date;

    if (customStart && customEnd) {
      currentStart = customStart;
      currentEnd = customEnd;
      const diff = currentEnd.getTime() - currentStart.getTime();
      previousEnd = new Date(currentStart.getTime() - 1);
      previousStart = new Date(previousEnd.getTime() - diff);
    } else {
      switch (period) {
        case 'day':
          currentStart = new Date(now.setHours(0, 0, 0, 0));
          currentEnd = new Date(now.setHours(23, 59, 59, 999));
          previousStart = new Date(
            currentStart.getTime() - 24 * 60 * 60 * 1000,
          );
          previousEnd = new Date(currentStart.getTime() - 1);
          break;
        case 'week': {
          const dayOfWeek = now.getDay();
          currentStart = new Date(now.setDate(now.getDate() - dayOfWeek));
          currentStart.setHours(0, 0, 0, 0);
          currentEnd = new Date(
            currentStart.getTime() + 7 * 24 * 60 * 60 * 1000 - 1,
          );
          previousStart = new Date(
            currentStart.getTime() - 7 * 24 * 60 * 60 * 1000,
          );
          previousEnd = new Date(currentStart.getTime() - 1);
          break;
        }
        case 'quarter': {
          const quarter = Math.floor(now.getMonth() / 3);
          currentStart = new Date(now.getFullYear(), quarter * 3, 1);
          currentEnd = new Date(
            now.getFullYear(),
            quarter * 3 + 3,
            0,
            23,
            59,
            59,
            999,
          );
          previousStart = new Date(
            currentStart.getFullYear(),
            currentStart.getMonth() - 3,
            1,
          );
          previousEnd = new Date(currentStart.getTime() - 1);
          break;
        }
        case 'year':
          currentStart = new Date(now.getFullYear(), 0, 1);
          currentEnd = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
          previousStart = new Date(now.getFullYear() - 1, 0, 1);
          previousEnd = new Date(currentStart.getTime() - 1);
          break;
        case 'month':
        default:
          currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
          currentEnd = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0,
            23,
            59,
            59,
            999,
          );
          previousStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          previousEnd = new Date(currentStart.getTime() - 1);
          break;
      }
    }

    return { currentStart, currentEnd, previousStart, previousEnd };
  }

  private calculateTrend(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Number((((current - previous) / previous) * 100).toFixed(1));
  }

  private async getViewsWithoutPurchase() {
    const productsWithViews = await this.prisma.productView.groupBy({
      by: ['productId'],
      _count: { productId: true },
      orderBy: { _count: { productId: 'desc' } },
      take: 20,
    });

    const productsWithPurchases = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      _count: { productId: true },
    });

    const purchasedIds = new Set(productsWithPurchases.map((p) => p.productId));

    const viewedButNotPurchased = productsWithViews.filter(
      (p) => !purchasedIds.has(p.productId),
    );

    return Promise.all(
      viewedButNotPurchased.slice(0, 5).map(async (item) => {
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
          views: item._count.productId,
        };
      }),
    );
  }

  private async getTopCategories(startDate: Date, endDate: Date) {
    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        status: { in: ['PAID', 'PENDING'] },
      },
      include: {
        items: {
          include: {
            product: {
              select: { category: true },
            },
          },
        },
      },
    });

    const categoryMap = new Map<string, number>();

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const category = item.product.category || 'Sin categoría';
        categoryMap.set(
          category,
          (categoryMap.get(category) || 0) + item.quantity,
        );
      });
    });

    const total = Array.from(categoryMap.values()).reduce((a, b) => a + b, 0);

    return Array.from(categoryMap.entries())
      .map(([name, value]) => ({
        name,
        value,
        percentage: total > 0 ? Number(((value / total) * 100).toFixed(1)) : 0,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }

  private async getSalesByHour(startDate: Date, endDate: Date) {
    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        status: { in: ['PAID', 'PENDING'] },
      },
      select: { createdAt: true, total: true },
    });

    const hourMap = new Map<number, { count: number; revenue: number }>();

    // Initialize all hours
    for (let i = 0; i < 24; i++) {
      hourMap.set(i, { count: 0, revenue: 0 });
    }

    orders.forEach((order) => {
      const hour = order.createdAt.getHours();
      const current = hourMap.get(hour);
      hourMap.set(hour, {
        count: current.count + 1,
        revenue: current.revenue + order.total,
      });
    });

    return Array.from(hourMap.entries()).map(([hour, data]) => ({
      hour,
      hourLabel: `${hour.toString().padStart(2, '0')}:00`,
      count: data.count,
      revenue: data.revenue,
    }));
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

    const currentDate = new Date();
    const last6Months: Array<{
      month: string;
      year: number;
      revenue: number;
      rawDate: Date;
    }> = [];

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

  private getHoursSince(date: Date): number {
    return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
  }
}
