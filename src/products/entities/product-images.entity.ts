
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductImages {
  @PrimaryGeneratedColumn()
  id: number;
  
  @ManyToOne(() => Product, (product) => product.images, { onDelete: 'CASCADE' }) // If a product is deleted, delete its images
  @JoinColumn({ name: 'product_id' }) // The column in the 'products' table that stores the category foreign key
  product: Product;

  @Column()
  image: string
}