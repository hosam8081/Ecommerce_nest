import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsPositive, IsInt, IsDecimal, ValidateNested } from 'class-validator';
import { CreateCategoryDto } from 'src/categories/dto/create-category.dto';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsPositive()
  price: number;

  @IsOptional()
  @IsPositive()
  old_price?: number;

  @IsNotEmpty()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  stock: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateCategoryDto)
  category: CreateCategoryDto;
}