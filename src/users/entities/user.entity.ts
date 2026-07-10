import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Loan } from '../../loans/entities/loan.entity'; // Asegúrate de que la ruta coincida con tu estructura

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  /* 🎓 REGLA DE ROLES ACTUALIZADA: Se expande para soportar las reglas financieras de la pizarra */
  @Column({ 
    type: 'varchar', 
    default: 'user' 
  })
  rol!: 'admin' | 'bibliotecario' | 'subadmin' | 'estudiante' | 'profesor' | 'cliente' | 'user';

  @OneToMany(() => Loan, (loan) => loan.user)
  prestamos?: Loan[];
}