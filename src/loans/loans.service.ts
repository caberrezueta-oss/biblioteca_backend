import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loan } from './entities/loan.entity';
import { Book } from '../books/entities/book.entity';
import { User } from '../users/entities/user.entity';
import { CreateLoanDto } from './dto/create-loan.dto';

@Injectable()
export class LoansService {
  constructor(
    @InjectRepository(Loan)
    private readonly loanRepository: Repository<Loan>,

    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 1. Registrar un nuevo préstamo con reglas de negocio de la pizarra
  async create(createLoanDto: CreateLoanDto): Promise<Loan> {
    // Verificar si el libro existe y está disponible
    const book = await this.bookRepository.findOneBy({ id: createLoanDto.bookId });
    if (!book) {
      throw new NotFoundException(`El libro con ID ${createLoanDto.bookId} no existe.`);
    }
    if (!book.disponible) {
      throw new BadRequestException('Este libro ya se encuentra prestado en este momento.');
    }

    // Verificar si el usuario existe para conocer su rol
    const user = await this.userRepository.findOneBy({ id: createLoanDto.userId });
    if (!user) {
      throw new NotFoundException(`El usuario con ID ${createLoanDto.userId} no existe.`);
    }
    // REGLA DE LA PIZARRA: máximo 3 préstamos activos por usuario
    const prestamosActivos = await this.loanRepository.count({
      where: { user: { id: createLoanDto.userId }, estado: 'active' },
    });
    if (prestamosActivos >= 3) {
      throw new BadRequestException('Este usuario ya tiene el máximo de 3 préstamos activos.');
    }

    // 💸 REGLAS DE LA PIZARRA: Definir costos y descuentos según rol del usuario
    const costoBaseEstandar = 2.0;
    let descuento = 0.0;

    if (user.rol === 'profesor') {
      descuento = costoBaseEstandar; // Préstamos GRATIS (100% descuento)
    } else if (user.rol === 'estudiante') {
      descuento = costoBaseEstandar * 0.5; // 50% de Descuento
    } else if (user.rol === 'admin' || user.rol === 'bibliotecario') {
      descuento = costoBaseEstandar; // El staff tampoco paga
    }

    // Marcar el libro como NO disponible
    book.disponible = false;
    await this.bookRepository.save(book);

    // Crear el registro del préstamo con los nuevos campos financieros
    const newLoan = this.loanRepository.create({
      user: { id: createLoanDto.userId },
      book: { id: createLoanDto.bookId },
      documentoEntregado: createLoanDto.documentoEntregado,
      costoBase: costoBaseEstandar - descuento, // Se guarda el precio neto cobrado
      descuentoAplicado: descuento,
      multaAcumulada: 0.0,
      estado: 'active',
    });

    return await this.loanRepository.save(newLoan);
  }

  // 2. Obtener todos los préstamos registrados (Estructura correcta para find)
  async findAll(): Promise<Loan[]> {
    return await this.loanRepository.find({
      relations: { user: true, book: true } //  Cambiado a objeto booleano
    });
  }

  // 3. Obtener un préstamo específico por su ID (Estructura correcta para findOne)
  async findOne(id: number): Promise<Loan> {
    const loan = await this.loanRepository.findOne({
      where: { id },
      relations: { user: true, book: true } //  Cambiado a objeto booleano
    });
    if (!loan) {
      throw new NotFoundException(`Préstamo con ID ${id} no encontrado`);
    }
    return loan;
  }

  // ✅ 4. Procesar la devolución con verificación de permisos
  async returnBook(id: number, usuarioActual: { id: number; rol: string }): Promise<Loan> {
    const loan = await this.findOne(id);

    if (loan.estado === 'returned') {
      throw new BadRequestException('Este préstamo ya fue devuelto anteriormente.');
    }

    // 🔒 REGLA: solo el dueño del préstamo o personal de biblioteca puede marcarlo como devuelto
    const esPersonalBiblioteca = ['admin', 'subadmin', 'bibliotecario'].includes(usuarioActual.rol);
    const esDueno = loan.user?.id === usuarioActual.id;

    if (!esDueno && !esPersonalBiblioteca) {
      throw new ForbiddenException('No tienes permiso para devolver un préstamo que no es tuyo.');
    }

    const ahora = new Date();
    loan.estado = 'returned';
    loan.fechaDevolucion = ahora;

    // Lógica de Multas: Calcular diferencia de días entre préstamo y devolución
    const msPorDia = 1000 * 60 * 60 * 24;
    const tiempoPrestadoMs = ahora.getTime() - new Date(loan.fechaPrestamo).getTime();
    const diasTranscurridos = Math.floor(tiempoPrestadoMs / msPorDia);

    // REGLA DE LA PIZARRA: el límite de 10 días con multa solo aplica a cliente y estudiante.
    // Profesor, admin, subadmin y bibliotecario quedan exentos
    const rolConLimite = loan.user?.rol === 'cliente' || loan.user?.rol === 'estudiante';

    if (rolConLimite && diasTranscurridos > 10) {
      const diasDeRetraso = diasTranscurridos - 10;
      loan.multaAcumulada = diasDeRetraso * 1.0;
    } else {
      loan.multaAcumulada = 0.0;
    }

    // Devolver el libro al catálogo (Marcarlo como disponible otra vez)
    if (loan.book) {
      const book = await this.bookRepository.findOneBy({ id: loan.book.id });
      if (book) {
        book.disponible = true;
        await this.bookRepository.save(book);
      }
    }

    return await this.loanRepository.save(loan);
  }
}