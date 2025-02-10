import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { User } from 'src/auth/user.entity';
import { CartItem } from 'src/carts/entities/cart-item.entity';
import { CartsService } from 'src/carts/carts.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepository: Repository<OrderItem>,
    private cartService: CartsService,
  ) {}

  async createOrder(user: User) {
    const cart = await this.cartService.getCart(user);
  
    if (!cart.items.length) {
      throw new NotFoundException('Cart is empty');
    }
  
    let totalPrice = 0;
    const orderItems:any = [];
  
    // Create an order
    const order = this.orderRepository.create({ user, items: [], totalPrice });
    await this.orderRepository.save(order);
  
    for (const cartItem of cart.items) {
      const orderItem = this.orderItemRepository.create({
        order,
        product: cartItem.product,
        price: cartItem.price,
        quantity: cartItem.quantity,
      });
  
      totalPrice += cartItem.price * cartItem.quantity;
      orderItems.push(orderItem);
    }
  
    // Batch save all order items
    await this.orderItemRepository.save(orderItems);
  
    // Update order total price and items
    order.totalPrice = totalPrice;
    order.items = orderItems;
    await this.orderRepository.save(order);
  
    // Clear the cart after order is placed
    await this.cartService.clear(user);
  
    return order;
  }

  getOrders(user: User) {
    return this.orderRepository.find({ where: { user }, relations: ['items', 'items.product'] });
  }
}
