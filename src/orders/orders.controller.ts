import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from 'src/auth/jwt-aut.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard) 
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  createOrder(@Req() req, @Body("shipping_id") shipping_id) {
    return this.ordersService.createOrder(req.user, shipping_id);
  }

  @Get()
  getOrders(@Req() req) {
    return this.ordersService.getOrders(req.user);
  }
}
