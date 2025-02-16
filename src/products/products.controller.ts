import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/auth/jwt-aut.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/auth/user.entity';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';

const storage = diskStorage({
  destination: './uploads',
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
  },
});

@Controller('products')
export class ProductsController {
  private readonly baseUrl = 'http://localhost:3000';
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAllProducts(@Query('') query: string) {
    return this.productsService.findAllProducts(query);
  }

  @Get(':id')
  findOneProduct(@Param('id') id: string) {
    return this.productsService.findOneProduct(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard) // Protect this route
  @Roles(UserRole.ADMIN) // Only admins can create products
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: storage,
    }),
  )
  createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const imageUrl = image
      ? `${this.baseUrl}/uploads/${image.filename}`
      : 'https';
    return this.productsService.create(createProductDto, imageUrl);
  }

  @UseGuards(JwtAuthGuard, RolesGuard) // Protect this route
  @Roles(UserRole.ADMIN) // Only admins can create products
  @Patch(':id')
  updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(+id, updateProductDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard) // Protect this route
  @Roles(UserRole.ADMIN) // Only admins can create products
  @Delete(':id')
  removeProduct(@Param('id') id: string) {
    return this.productsService.removeProduct(+id);
  }


  // -------------- products Images --------------
  @UseGuards(JwtAuthGuard, RolesGuard) // Protect this route
  @Roles(UserRole.ADMIN) // Only admins can create products
  @Post(':product_id/upload_images')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 10 }], {
      storage: storage,
    }),
  )
  async uploadImages(
    @Param('product_id') product_id: number,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    if (!files.images || files.images.length === 0) {
      throw new Error('No images uploaded');
    }
    return this.productsService.uploadImages(product_id, files.images);
  }

  @UseGuards(JwtAuthGuard, RolesGuard) // Protect this route
  @Roles(UserRole.ADMIN) // Only admins can create products
  @Delete(':product_id/upload_images/:img_id')
  removeProductImage(@Param('product_id') product_id: string, @Param('img_id') img_id: string) {
    return this.productsService.removeProductImage(+product_id, +img_id);
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':product_id/upload_images/:img_id')
  @UseInterceptors(
    FileInterceptor("file", {
      storage: storage,
    }),
  )
  async updateImage(
    @Param('product_id') product_id: number,
    @Param('img_id') img_id: number,
    @UploadedFile() file: { images?: Express.Multer.File[] },
  ) {

    return this.productsService.updateProductImage(product_id, img_id, file);
  }
}
