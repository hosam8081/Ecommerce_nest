
import { Category } from 'src/categories/entities/category.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2 })
  old_price: number;

  @Column()
  image: string

  @Column('int')
  stock: number;

  @ManyToOne(() => Category, category => category.products) // Many products belong to one category
  @JoinColumn({ name: 'category_id' }) // The column in the 'products' table that stores the category foreign key
  category: Category;
}