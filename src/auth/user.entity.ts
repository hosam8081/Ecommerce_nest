import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ShippingAddress } from 'src/shippings/entities/shipping.entity';

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
}
  
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({})
  first_name: string;

  @Column({})
  last_name: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @OneToMany(() => ShippingAddress, (shipping) => shipping.id)
  shippingAddresses: ShippingAddress[]

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}