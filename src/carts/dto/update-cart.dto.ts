import { PartialType } from '@nestjs/mapped-types';
import { AddToCartDto } from './add-to-cart.dto';
import { IsNumber } from 'class-validator';

export class UpdateCartDto extends PartialType(AddToCartDto) {
    @IsNumber()
    cartId: number;
}
