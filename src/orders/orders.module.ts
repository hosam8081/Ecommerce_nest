import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from 'src/products/entities/product.entity';
import { CartItem } from 'src/carts/entities/cart-item.entity';
import { CartsModule } from 'src/carts/carts.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Product, CartItem]), CartsModule],  
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
