import { User } from "src/auth/user.entity";
import { Product } from "src/products/entities/product.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "reviews" })
export class Review {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Product, (product) => product.reviews, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'product_id' })
    product: Product[]

    @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    comment: string

    @Column({type: 'int', default: 0})
    rating: number

    @CreateDateColumn()
    createdAt: Date;
}
