import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from 'src/auth/jwt-aut.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/auth/user.entity';
import { ChangeStatusDto } from './dto/change-status.dto';

@UseGuards(JwtAuthGuard, RolesGuard) // Protect this route
@Controller('admin/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}


  @Get()
  @Roles(UserRole.ADMIN) // Only admins can create products
  findAllOrders() {
    return this.ordersService.findAllOrders();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN) // Only admins can create products
  findOneOrder(@Param('id') id: string) {
    return this.ordersService.findOneOrder(+id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN) // Only admins can create products
  changeStatus(@Param('id') id: string, @Body() updateOrderDto: ChangeStatusDto) {
    return this.ordersService.changeStatus(+id, updateOrderDto);
  }
}
