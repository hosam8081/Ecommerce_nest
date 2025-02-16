import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({name: "order_id"})
  order: Order;

  @Column({ type: 'varchar', length: 50 })
  status: 'pending' | 'succeeded' | 'failed';

  @Column({ nullable: true })
  transactionId: string;

  @Column({ nullable: true })
  paymentMethod: string;

  @Column({ nullable: true })
  paymobOrderId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}