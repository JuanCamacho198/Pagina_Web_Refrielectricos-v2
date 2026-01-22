import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { CouponsModule } from '../coupons/coupons.module';
import { AuditLogsModule } from '../modules/audit-logs/audit-logs.module';
import { EmailModule } from '../modules/email/email.module';

@Module({
  imports: [NotificationsModule, CouponsModule, AuditLogsModule, EmailModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
