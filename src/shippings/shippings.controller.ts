import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ShippingsService } from './shippings.service';
import { CreateShippingDto } from './dto/create-shipping.dto';
import { UpdateShippingDto } from './dto/update-shipping.dto';
import { JwtAuthGuard } from 'src/auth/jwt-aut.guard';


@UseGuards(JwtAuthGuard)
@Controller('shippings')
export class ShippingsController {
  constructor(private readonly shippingsService: ShippingsService) {}

  @Get()
  findAllShipping(@Req() req) {
    return this.shippingsService.findAllShipping(req.user);
  }

  @Post()
  createShipping(@Req() req, @Body() createShippingDto: CreateShippingDto) {
    return this.shippingsService.createShipping(req.user, createShippingDto);
  }

  @Delete(':id')
  removeShipping(@Param('id') id: string) {
    return this.shippingsService.removeShipping(+id);
  }
}
