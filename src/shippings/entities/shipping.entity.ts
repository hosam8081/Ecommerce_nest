import { User } from "src/auth/user.entity";
import { Order } from "src/orders/entities/order.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: "shipping_addressess" })
export class ShippingAddress {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    address: string

    @Column()
    city: string;
  
    @Column()
    state: string;
  
    @Column()
    postalCode: string;

    @Column({ default: false })
    isDefault: boolean;

    @ManyToOne(() => User, (user) => user.shippingAddresses, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => Order, (order) => order.shippingAddress)
    orders: Order[];
}
