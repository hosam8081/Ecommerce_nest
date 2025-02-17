import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class ReviewsService {
    constructor(
      @InjectRepository(Review) private reviewRepository: Repository<Review>,
      @InjectRepository(Product) private productRepository: Repository<Product>,
    ) {}


  findAllReviews() {
    return this.reviewRepository.find()
  }

  async createReview(createReviewDto: CreateReviewDto, product_id: number, user: User) {
    const product = await this.productRepository.findOne({ where: { id: product_id } });
    if (!product) throw new NotFoundException('Product not found');
    
    const existingReview = await this.reviewRepository.findOne({where: {product: {id: product_id}, user: {id: user.id}}})
    if (existingReview) {
      return {message: "user can not add multiple review"}
    } 


    let newReview = this.reviewRepository.create({...createReviewDto, user, product} as any)
    await this.reviewRepository.save(newReview) 

    const productReview = await this.productRepository.findOne({where: {id: product_id}, relations: {reviews: true}})
    
    return {message: "review created succssfuly", data: productReview};
  }

  async updateReview(updateReviewDto: UpdateReviewDto, product_id: number, review_id: number) {
    const existingReview: any = await this.reviewRepository.findOne({
        where: { id: review_id, product: { id: product_id } },
    });

    if (!existingReview) {
        throw new NotFoundException('Product review not found');
    }

    // Update review properties
    existingReview.rating = updateReviewDto.rating;
    existingReview.comment = updateReviewDto.comment;

    // Save updated review
    await this.reviewRepository.save(existingReview);

    return {
        message: 'Review updated successfully',
        review: existingReview,
    };
  }

 async removeReview(product_id: number, review_id:number) {
    const product = await this.productRepository.findOne({ where: { id: product_id } });
    if (!product) throw new NotFoundException('Product not found');

    const existingReview = await this.reviewRepository.findOne({where: {product: product, id: review_id}})
    if (!existingReview) throw new NotFoundException('Product Review not found');

    await this.reviewRepository.remove(existingReview)


    return this.productRepository.findOne({where: {id: product_id}, relations: {reviews: true}});
 }
}
