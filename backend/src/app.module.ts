import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { AddressesModule } from './addresses/addresses.module';
import { FilesModule } from './files/files.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    PrismaModule,
    ProductsModule,
    UsersModule,
    OrdersModule,
    AuthModule,
    DashboardModule,
    WishlistsModule,
    AddressesModule,
    FilesModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
