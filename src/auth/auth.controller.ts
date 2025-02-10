import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRole } from './user.entity';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    register(@Body('email') email: string, @Body('password') password: string, @Body('role') role: UserRole = UserRole.USER,) {
      return this.authService.register(email, password, role);
    }

    @Post('login')
    login(@Body('email') email: string, @Body('password') password: string) {
      return this.authService.login(email, password);
    }
}
