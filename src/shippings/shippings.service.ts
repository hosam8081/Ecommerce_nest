import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateShippingDto } from './dto/create-shipping.dto';
import { UpdateShippingDto } from './dto/update-shipping.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ShippingAddress } from './entities/shipping.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';

@Injectable()
export class ShippingsService {
  constructor(
    @InjectRepository(ShippingAddress)
    private shippingRepository: Repository<ShippingAddress>,
  ) {}

  findAllShipping(user: User) {
    return this.shippingRepository.find({ where: { user: { id: user.id } } });
  }

  async createShipping(user, createShippingDto) {
   const shipping = await this.findAllShipping(user);

    if (shipping.length > 3) {
      return { message: 'you can not add more than 3 addressess' };
    }

    const address = this.shippingRepository.create({
      ...createShippingDto,
      user: { id: user.id },
    });
    return this.shippingRepository.save(address);
  }

  async removeShipping(id: number) {
    const category = await this.shippingRepository.findOne({
      where: { id: id },
    });
    if (!category) {
      throw new HttpException('Shipping not found', HttpStatus.NOT_FOUND);
    }

    await this.shippingRepository.remove(category);

    return { message: 'Shipping deleted successfully' };
  }
}
