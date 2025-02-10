import { Injectable } from '@nestjs/common';
import { Favorite } from './entities/favorite.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite) private favRepository: Repository<Favorite>,
  ) {}

  findAllFavorites(user) {
    return this.favRepository.find({
      where: { user: user },
      relations: ['user', 'product'],
    });
  }

  async updateFavItem(id: number, user) {
    const favItem = await this.favRepository.findOne({
      where: { user: user, product: { id: id} },
      relations: ['user', 'product'],
    });

    if (favItem) {
      // remove it from database
      await this.favRepository.remove(favItem);
    } else {
      // add it to database
      const newFavItem = this.favRepository.create({
        user: user,
        product: { id: id},
      });
      await this.favRepository.save(newFavItem);
    }
    return this.findAllFavorites(user);
  }
}
