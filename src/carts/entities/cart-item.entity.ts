import { Product } from "src/products/entities/product.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "./cart.entity";



@Entity({name: "cart_items"})
export class CartItem {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Cart, (cart) => cart.items, {onDelete: "CASCADE"})
    cart: Cart

    @ManyToOne(() => Product, { eager: true })
    product: Product

    @Column({ default: 1})
    quantity: number

    @Column()
    price: number;

    get totalPrice(): number {
        return this.price * this.quantity;
    }
}