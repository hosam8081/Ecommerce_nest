import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { HttpException, HttpStatus } from '@nestjs/common';


@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = this.productsRepository.create(createProductDto)
    await this.productsRepository.save(product);
    return product;
  }

  findAll(): Promise<Product[]> {
    return this.productsRepository.find({relations: {category: true}});
  }

  findOne(id: number) {
    return this.productsRepository.findOne({where: {id: id}, relations: {category: true}});
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: number) {
    const product = await this.productsRepository.findOne({where: {id: id}})

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    await this.productsRepository.remove(product)

    return {message : "Product deleted successfully"};
  }
}
