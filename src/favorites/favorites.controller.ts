import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from 'src/auth/jwt-aut.guard';


@UseGuards(JwtAuthGuard) 
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  findAllFavorites(@Req() req) {
    return this.favoritesService.findAllFavorites(req.user);
  }

  @Patch(':id')
  updateFavItem(@Param('id') id: string, @Req() req) {
    return this.favoritesService.updateFavItem(+id, req.user);
  }
}
