import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  titulo!: string;

  @Column()
  autor!: string;

  @Column({ unique: true })
  isbn!: string;

  @Column()
  genero!: string;

  @Column({ name: 'anio_publicacion' })
  anioPublicacion!: number;

  @Column({ default: true })
  disponible!: boolean;
}