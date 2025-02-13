import { IsNotEmpty, IsString, IsOptional, IsPositive, IsInt } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  price: number;

  @IsOptional()
  old_price?: number;
  
  @IsNotEmpty()
  stock: number;

  @IsNotEmpty()
  category_id: number;
}