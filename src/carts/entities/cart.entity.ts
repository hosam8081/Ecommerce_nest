import { User } from "src/auth/user.entity";
import { Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CartItem } from "./cart-item.entity";

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => User, {onDelete: "CASCADE"})
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { cascade: true })
    items: CartItem[]
}
