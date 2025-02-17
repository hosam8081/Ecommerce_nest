import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ProductImages } from './entities/product-images.entity';

@Injectable()
export class ProductsService {
  private readonly baseUrl = 'http://localhost:3000';

  constructor(
    @InjectRepository(Product) private productsRepository: Repository<Product>,
    @InjectRepository(ProductImages) private productsImagesRepository: Repository<ProductImages>,
  ) {}

  async create(createProductDto: CreateProductDto, imageUrl:string) {
    const product = this.productsRepository.create({...createProductDto, category: {id: createProductDto.category_id}, image:imageUrl});
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
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.reviews', 'reviews') // Join reviews to calculate rating
      
      
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

  findOneProduct(id: number) {
    return this.productsRepository.findOne({
      where: { id: id },
      relations: { category: true, images: true, reviews: true },
    });
  }

  updateProduct(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async removeProduct(id: number) {
    const product = await this.productsRepository.findOne({
      where: { id: id },
    });

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    await this.productsRepository.remove(product);

    return { message: 'Product deleted successfully' };
  }


  // ------------ post Images for product ---------
  async uploadImages(product_id, images) {
    const product = await this.productsRepository.findOne({where: {id: product_id}, relations: {images: true}})
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    const newImages:ProductImages[] = []

    images.forEach(img => {
      const productImage = this.productsImagesRepository.create({
        image: `${this.baseUrl}/uploads/${img.filename}`,
        product: {id: product_id} 
      })
      newImages.push(productImage)
    });

    await this.productsImagesRepository.save(newImages)

    return this.findOneProduct(product_id)
  }

  async removeProductImage(product_id: number, image_id: number) {
    const product = await this.productsImagesRepository.findOne({
      where: { id: image_id, product: {id: product_id} },
    });

    if (!product) {
      throw new HttpException('Product image not found', HttpStatus.NOT_FOUND);
    }
    await this.productsImagesRepository.remove(product);

    return { message: 'Product image deleted successfully' };
  }

  async updateProductImage(product_id: number, image_id: number, newImage) {
    const productImg = await this.productsImagesRepository.findOne({
      where: { id: image_id, product: {id: product_id} },
    });

    if (!productImg) {
      throw new HttpException('Product image not found', HttpStatus.NOT_FOUND);
    } else {
      productImg.image = `${this.baseUrl}/uploads/${newImage.filename }`
    }


    await this.productsImagesRepository.save(productImg);

    return this.findOneProduct(product_id);
  }
}
