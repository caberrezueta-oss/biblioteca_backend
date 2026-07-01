import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module'; // 👈 Asegúrate de que esté este import
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule, // 👈 ¡ESTO FALTA! Conecta la autenticación con los usuarios
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'SECRET_KEY_TEMPORAL', // Usa tu variable de entorno
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}