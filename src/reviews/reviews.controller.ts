import { Controller, Post, Body, Param, Delete, Req, UseGuards, Patch, Get } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from 'src/auth/jwt-aut.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/auth/user.entity';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':product_id/reviews/')
  createReview(@Body() createReviewDto: CreateReviewDto, @Param('product_id') product_id: string, @Req() req) {
    return this.reviewsService.createReview(createReviewDto, +product_id, req.user);
  }

  // ---------- For Admin ------------

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':product_id/reviews/:review_id')
  updateReview(@Body() updateReviewDto:UpdateReviewDto, @Param('product_id') product_id: string, @Param('review_id') review_id: string) {
    return this.reviewsService.updateReview(updateReviewDto, +product_id, +review_id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':product_id/reviews/:review_id')
  removeReview(@Param('product_id') product_id: string, @Param('review_id') review_id: string) {
    return this.reviewsService.removeReview(+product_id, +review_id);
  }
}
