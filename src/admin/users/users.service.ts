import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/auth/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate } from 'src/common/utils/paginate';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findAllUsers(page, limit) {
    const query = this.userRepository.createQueryBuilder('user');
    return paginate(query, page, limit);
  }

  findOneUser(id: number) {
    return this.userRepository.findOne({ where: { id: id } });
  }

  async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    await this.userRepository.update(id, updateUserDto);
    return this.userRepository.findOne({ where: { id } });
  }

  async removeUser(id: number) {
    const category = await this.userRepository.findOne({
      where: { id: id },
    });

    if (!category) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }

    await this.userRepository.remove(category);

    return { message: 'user deleted successfully' };
  }
}
