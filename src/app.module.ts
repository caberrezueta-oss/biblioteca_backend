import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';

@Module({
  imports: [
    // Habilita la lectura del archivo .env de forma global
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // Configura TypeORM de manera asíncrona usando las variables del .env
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true, // Carga automáticamente las entidades que creemos
        synchronize: true,     // Crea/actualiza las tablas automáticamente en desarrollo
      }),
    }),

    // ¡AQUÍ ESTÁ LA SOLUCIÓN! Importamos los módulos para que NestJS los reconozca
    UsersModule,
    AuthModule,
    BooksModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}