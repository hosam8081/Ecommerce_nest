import { User } from "src/auth/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
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
}
