import { IsNotEmpty, IsNumber } from "class-validator"

export class AddToCartDto {
    @IsNotEmpty()
    @IsNumber()
    product_id: number

    @IsNotEmpty()
    @IsNumber()
    quantity: number

    @IsNotEmpty()
    @IsNumber()
    cartId: number
}