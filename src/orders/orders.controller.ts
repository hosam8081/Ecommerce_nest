import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from 'src/auth/jwt-aut.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard) 
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  createOrder(@Req() req) {
    return this.ordersService.createOrder(req.user);
  }

  @Get()
  getOrders(@Req() req) {
    return this.ordersService.getOrders(req.user);
  }
}
