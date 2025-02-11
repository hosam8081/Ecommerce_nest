import { IsEnum } from "class-validator";
import { OrderStatus } from "src/orders/entities/order.entity";

export class ChangeStatusDto {
  @IsEnum(OrderStatus, {
    message: 'Invalid role, must be one of: pending, processing, shipped, delivered, or canceled',
  })
  status: OrderStatus = OrderStatus.PENDING; // Default role is Order
}
