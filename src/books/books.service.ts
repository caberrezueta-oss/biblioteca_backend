import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>, // Inyectamos el repositorio de TypeORM
  ) {}

// 1. Crear un libro nuevo
  async create(createBookDto: any): Promise<any> {
    const newBook = this.bookRepository.create(createBookDto);
    return await this.bookRepository.save(newBook);
  }

  // 2. Obtener todos los libros
  async findAll(): Promise<any[]> {
    return await this.bookRepository.find();
  }

  // 3. Obtener un solo libro por su ID
  async findOne(id: number): Promise<Book> {
    const book = await this.bookRepository.findOneBy({ id });
    if (!book) {
      throw new NotFoundException(`Libro con ID ${id} no encontrado`);
    }
    return book;
  }

  // 4. Actualizar los datos de un libro
  async update(id: number, updateBookDto: any): Promise<Book> {
    const book = await this.findOne(id); // Verifica si existe primero
    const updatedBook = Object.assign(book, updateBookDto);
    return await this.bookRepository.save(updatedBook);
  }

  // 5. Eliminar un libro
  async remove(id: number): Promise<void> {
    const book = await this.findOne(id); // Verifica si existe primero
    await this.bookRepository.remove(book);
  }
}