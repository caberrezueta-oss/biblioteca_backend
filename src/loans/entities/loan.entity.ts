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

  // Relación: Muchos préstamos pueden pertenecer a un usuario
  @ManyToOne(() => User, { eager: true })
  user!: User;

  // Relación: Muchos préstamos pueden asociarse a un libro
  @ManyToOne(() => Book, { eager: true })
  book!: Book;
}