import { IsBoolean, IsNotEmpty, IsNumber } from "class-validator";

export class CreateShippingDto {
    @IsNotEmpty()
    address: string
    
    @IsNotEmpty()
    city: string;

    @IsNotEmpty()
    state: string;

    @IsNotEmpty()
    @IsNumber()
    postalCode: number;
}
