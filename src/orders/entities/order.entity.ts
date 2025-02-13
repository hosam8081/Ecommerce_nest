import { User } from "src/auth/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from "./order-item.entity";
import { ShippingAddress } from "src/shippings/entities/shipping.entity";

export enum OrderStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELED = 'canceled',
  }

@Entity({ name: "orders" })
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
    items: OrderItem[]
    
    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    totalPrice: number;

    @Column({ type:"enum", enum:OrderStatus, default: 'pending' }) // Order status: pending, completed, canceled
    status: OrderStatus;

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => ShippingAddress, (shippingAddress) => shippingAddress.orders)
    @JoinColumn({ name: 'shipping_id' })
    shippingAddress: ShippingAddress;
}
