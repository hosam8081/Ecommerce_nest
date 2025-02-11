import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-aut.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/auth/user.entity';
import { Roles } from 'src/auth/roles.decorator';
import { PaginationDto } from 'src/common/utils/paginate';


@UseGuards(JwtAuthGuard, RolesGuard) // Protect this route
@Controller('admin/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(UserRole.ADMIN) // Only admins can create products
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Roles(UserRole.ADMIN) // Only admins can create products
  @Get()
  findAllUsers(
    @Query() pagination?: PaginationDto,
  ) {
    return this.usersService.findAllUsers(pagination?.page, pagination?.limit);
  }

  @Roles(UserRole.ADMIN) // Only admins can create products
  @Get(':id')
  findOneUser(@Param('id') id: string) {
    return this.usersService.findOneUser(+id);
  }

  @Roles(UserRole.ADMIN) // Only admins can create products
  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(+id, updateUserDto);
  }

  @Roles(UserRole.ADMIN) // Only admins can create products
  @Delete(':id')
  removeUser(@Param('id') id: string) {
    return this.usersService.removeUser(+id);
  }
}
