import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Book } from '../../books/entities/book.entity';

@Entity('loans')
export class Loan {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'loan_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaPrestamo!: Date;

  @Column({ name: 'return_date', type: 'timestamp', nullable: true })
  fechaDevolucion!: Date | null;

  @Column({ default: 'active' }) // 'active' o 'returned'
  estado!: string;

  // NUEVO: Documento físico o de identidad que deja el usuario en garantía
  @Column({ name: 'documento_entregado', default: 'Ninguno' })
  documentoEntregado!: string;

  // NUEVO: Costo inicial fijado al momento del préstamo
  @Column({
    name: 'costo_base',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  costoBase!: number;

  // NUEVO: Descuento que se aplicó por su rol (Ej: 100% para admin/bibliotecario)
  @Column({
    name: 'descuento_aplicado',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  descuentoAplicado!: number;

  // NUEVO: Multa por retraso calculada al momento de la devolución
  @Column({
    name: 'multa_acumulada',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  multaAcumulada!: number;

  // Relación: Muchos préstamos pueden pertenecer a un usuario
  @ManyToOne(() => User, { eager: true })
  user!: User;

  // Relación: Muchos préstamos pueden asociarse a un libro
  @ManyToOne(() => Book, { eager: true })
  book!: Book;
}