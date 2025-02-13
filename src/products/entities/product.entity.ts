
import { Category } from 'src/categories/entities/category.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ProductImages } from './product-images.entity';

@Entity({ name: "products" })
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

  @OneToMany(() => ProductImages, (image) => image.product, { cascade: true }) // Enables automatic insertion of images when adding a product
  images: ProductImages[];
}