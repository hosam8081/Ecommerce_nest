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
    const product = this.productsRepository.create({...createProductDto, category: {id: createProductDto.category_id}});
    await this.productsRepository.save(product);
    return product;
  }

  async findAllProducts(query: any) {
    const {
      category_id,
      min_price,
      max_price,
      search,
      page = 1,
      limit = 10,
    } = query;

    const queryBuilder = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category');

    if (category_id) {
      queryBuilder.andWhere('category.id = :id', { id: category_id });
    }

    if (search) {
      queryBuilder.andWhere('product.name LIKE :search', {
        search: `%${search}%`,
      });
    }

    if (min_price) {
      queryBuilder.andWhere('product.price >= :min_price', {
        min_price: min_price,
      });
    }

    if (max_price) {
      queryBuilder.andWhere('product.price <= :max_price', { max_price });
    }

    // Get total count before pagination
    const total = await queryBuilder.getCount();
    const total_pages = Math.ceil(total / limit);

    const data = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
      
    return { data, page: +page, total_pages, count:total };
  }

  findOne(id: number) {
    return this.productsRepository.findOne({
      where: { id: id },
      relations: { category: true },
    });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: number) {
    const product = await this.productsRepository.findOne({
      where: { id: id },
    });

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    await this.productsRepository.remove(product);

    return { message: 'Product deleted successfully' };
  }
}
