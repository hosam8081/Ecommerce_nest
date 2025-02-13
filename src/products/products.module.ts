import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductImages } from './entities/product-images.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductImages])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
