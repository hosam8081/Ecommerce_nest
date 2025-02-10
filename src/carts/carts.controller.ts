import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { CartsService } from './carts.service';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from 'src/auth/jwt-aut.guard';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Controller('cart')
@UseGuards(JwtAuthGuard) 
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}


  @Get()
  getCart(@Req() req) {
    return this.cartsService.getCart(req.user)
  }

  @Post()
  addToCart(@Body() addToCartDto: AddToCartDto) {
    return this.cartsService.addToCart(addToCartDto);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto, @Req() req) {
    return this.cartsService.update(+id, updateCartDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.cartsService.remove(+id, req.user);
  }

  @Delete("")
  clear(@Req() req) {
    return this.cartsService.clear(req.user)
  }
}
