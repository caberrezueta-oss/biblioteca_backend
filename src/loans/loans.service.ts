import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loan } from './entities/loan.entity';

@Injectable()
export class LoansService {
  constructor(
    @InjectRepository(Loan)
    private readonly loanRepository: Repository<Loan>,
  ) {}

  // 1. Registrar un nuevo préstamo
  async create(createLoanDto: any): Promise<any> {
    const newLoan = this.loanRepository.create({
      user: { id: createLoanDto.userId }, // Relaciona el ID del usuario directamente
      book: { id: createLoanDto.bookId }, // Relaciona el ID del libro directamente
      estado: 'active',
    });
    return await this.loanRepository.save(newLoan);
  }

  // 2. Obtener todos los préstamos registrados
  async findAll(): Promise<any[]> {
    return await this.loanRepository.find();
  }

  // 3. Obtener un préstamo específico por su ID
  async findOne(id: number): Promise<any> {
    const loan = await this.loanRepository.findOneBy({ id });
    if (!loan) {
      throw new NotFoundException(`Préstamo con ID ${id} no encontrado`);
    }
    return loan;
  }

  // 4. Procesar la devolución de un libro (cambiar estado a devuelto)
  async returnBook(id: number): Promise<any> {
    const loan = await this.findOne(id);
    loan.estado = 'returned';
    loan.fechaDevolucion = new Date();
    return await this.loanRepository.save(loan);
  }
}