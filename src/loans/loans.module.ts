import { Module } from '@nestjs/common';
import { LoansService } from './loans.service';
import { LoansController } from './loans.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Loan } from './entities/loan.entity';
import { Book } from '../books/entities/book.entity'; // Importamos la entidad de Libros
import { User } from '../users/entities/user.entity'; // Importamos la entidad de Usuarios

@Module({
  imports: [TypeOrmModule.forFeature([Loan, Book, User])], // <-- Agregamos Book y User aquí
  controllers: [LoansController],
  providers: [LoansService],
})
export class LoansModule {}