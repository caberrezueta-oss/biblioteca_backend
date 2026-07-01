import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService, // Inyectamos Users para el registro
  ) {}

  // Ruta para registrar un usuario nuevo: POST http://localhost:3000/auth/register
  @Post('register')
  async register(@Body() createUserDto: any) {
    return await this.usersService.create(createUserDto);
  }

  // Ruta para iniciar sesión: POST http://localhost:3000/auth/login
  @Post('login')
  async login(@Body() loginDto: any) {
    return await this.authService.login(loginDto);
  }
}