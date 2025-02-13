import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/auth/jwt-aut.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/auth/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
@Controller('products')
export class ProductsController {
  private readonly baseUrl = 'http://localhost:3000';
  constructor(private readonly productsService: ProductsService) {}
  
  @Get()
  findAllProducts(@Query('') query: string ) {
    return this.productsService.findAllProducts(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard) // Protect this route
  @Roles(UserRole.ADMIN) // Only admins can create products
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads', // Save images locally (adjust as needed)
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExt = extname(file.originalname);
          callback(null, `${uniqueSuffix}${fileExt}`);
        },
      }),
    }),
  )
  create(@Body() createProductDto: CreateProductDto, @UploadedFile() image: Express.Multer.File) {

    const imageUrl = image ? `${this.baseUrl}/uploads/${image.filename}` : "https";
    return this.productsService.create(createProductDto, imageUrl);
  }

  @UseGuards(JwtAuthGuard, RolesGuard) // Protect this route
  @Roles(UserRole.ADMIN) // Only admins can create products
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard) // Protect this route
  @Roles(UserRole.ADMIN) // Only admins can create products
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
