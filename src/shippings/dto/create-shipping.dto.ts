import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateShippingDto {
  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  country: string;

  @IsNotEmpty()
  state: string;

  @IsNotEmpty()
  @IsNumber()
  postalCode: number;

  @IsNotEmpty()
  phone: number;

  @IsNotEmpty()
  street: string;

  @IsNotEmpty()
  building: string;

  @IsNotEmpty()
  floor: string;

  @IsNotEmpty()
  apartment: string;
}
