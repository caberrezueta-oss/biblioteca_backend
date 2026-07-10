import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id!: number;

  // 1. Le agregamos nullable y default para que Postgres no llore con los datos viejos
  @Column({ unique: true, nullable: true, default: null })
  codigo!: string; 

  @Column()
  titulo!: string;

  @Column()
  autor!: string;

  // 2. A esta también por si las moscas
  @Column({ default: 'Sin Editorial', nullable: true })
  editorial!: string; 

  @Column()
  genero!: string;

  @Column({ name: 'anio_publicacion' })
  anioPublicacion!: number;

  @Column({ default: true })
  disponible!: boolean;
}