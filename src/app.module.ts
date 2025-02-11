import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { Product } from './products/entities/product.entity';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/entities/category.entity';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/user.entity';
import { CartsModule } from './carts/carts.module';
import { Cart } from './carts/entities/cart.entity';
import { CartItem } from './carts/entities/cart-item.entity';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/entities/order.entity';
import { OrderItem } from './orders/entities/order-item.entity';
import { PaymentModule } from './payment/payment.module';
import { ConfigModule } from '@nestjs/config';
import { FavoritesModule } from './favorites/favorites.module';
import { Favorite } from './favorites/entities/favorite.entity';
import { ShippingsModule } from './shippings/shippings.module';
import { ShippingAddress } from './shippings/entities/shipping.entity';
import { UsersModule } from './admin/users/users.module';
import { OrdersModule as OrdersAdminModule} from './admin/orders/orders.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'StrongP@ssword1',
      database: 'newEcommerce',
      entities: [Product, Category, User, Cart, CartItem, Order, OrderItem, Favorite, ShippingAddress],
      synchronize: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true, // Loads .env globally
    }),
    ProductsModule,
    CategoriesModule,
    AuthModule,
    CartsModule,
    OrdersModule,
    PaymentModule,
    FavoritesModule,
    ShippingsModule,
    UsersModule,
    OrdersAdminModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
