import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User, UserRole } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
      ) {}

    async register(email: string, password: string, role: UserRole = UserRole.USER) {
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
          throw new UnauthorizedException('User already exists');
        }
    
        const newUser = this.userRepository.create({ email, password, role });
        await this.userRepository.save(newUser);
        return { message: 'User registered successfully', email };
      }

      async login(email: string, password: string) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
          throw new UnauthorizedException('Invalid credentials');
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new UnauthorizedException('Invalid credentials');
        }
    
        const payload = { id: user.id, email: user.email, role: user.role  };
        const token = this.jwtService.sign(payload);
        return { access_token: token, user: payload};
      }
}
