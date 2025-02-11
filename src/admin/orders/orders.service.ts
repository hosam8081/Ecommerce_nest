import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ChangeStatusDto } from './dto/change-status.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/orders/entities/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersService {
    constructor(
      @InjectRepository(Order) private orderRepository: Repository<Order>,
    ) {}

  findAllOrders() {
    return this.orderRepository.find({relations: ['user', 'items']});
  }

  findOneOrder(id: number) {
    return this.orderRepository.findOne({where:{id: id}, relations: ['user', 'items', 'items.product']});
  }

  async changeStatus(id: number, changeStatusDto: ChangeStatusDto) {
    const orderDetails =  await this.orderRepository.findOne({where: {id: id}, relations: ['user', 'items', 'items.product']});
    if (!orderDetails) {
       throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }

    orderDetails.status = changeStatusDto.status;
    return this.orderRepository.save(orderDetails)
  }
}
