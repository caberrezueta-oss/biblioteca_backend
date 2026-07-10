import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  // 0. Semillero con libros reales para pruebas
  async poblarCienLibros(): Promise<{ mensaje: string; insertados: number }> {
    const conteo = await this.bookRepository.count();
    if (conteo > 0) {
      throw new BadRequestException('La base de datos ya contiene libros activos.');
    }

    const librosBase = [
      { titulo: 'Don Quijote de la Mancha', autor: 'Miguel de Cervantes', editorial: 'Castalia', genero: 'Novela', anio: 1605 },
      { titulo: 'Cien años de soledad', autor: 'Gabriel García Márquez', editorial: 'Sudamericana', genero: 'Fantasía', anio: 1967 },
      { titulo: 'El resplandor', autor: 'Stephen King', editorial: 'Doubleday', genero: 'Terror', anio: 1977 },
      { titulo: '1984', autor: 'George Orwell', editorial: 'Secker & Warburg', genero: 'Ciencia Ficción', anio: 1949 },
      { titulo: 'Ficciones', autor: 'Jorge Luis Borges', editorial: 'Sur', genero: 'Novela', anio: 1944 },
      { titulo: 'Rayuela', autor: 'Julio Cortázar', editorial: 'Sudamericana', genero: 'Novela', anio: 1963 },
      { titulo: 'La sombra del viento', autor: 'Carlos Ruiz Zafón', editorial: 'Planeta', genero: 'Novela', anio: 2001 },
      { titulo: 'El nombre del viento', autor: 'Patrick Rothfuss', editorial: 'Plaza & Janés', genero: 'Fantasía', anio: 2007 },
      { titulo: 'Los pilares de la Tierra', autor: 'Ken Follett', editorial: 'Plaza & Janés', genero: 'Novela Histórica', anio: 1989 },
      { titulo: 'El amor en los tiempos del cólera', autor: 'Gabriel García Márquez', editorial: 'Sudamericana', genero: 'Novela', anio: 1985 },
      { titulo: 'La casa de los espíritus', autor: 'Isabel Allende', editorial: 'Plaza & Janés', genero: 'Novela', anio: 1982 },
      { titulo: 'El alquimista', autor: 'Paulo Coelho', editorial: 'Planeta', genero: 'Fantasía', anio: 1988 },
      { titulo: 'El principito', autor: 'Antoine de Saint-Exupéry', editorial: 'Reynal & Hitchcock', genero: 'Infantil', anio: 1943 },
      { titulo: 'Crónica de una muerte anunciada', autor: 'Gabriel García Márquez', editorial: 'Sudamericana', genero: 'Novela', anio: 1981 },
      { titulo: 'El túnel', autor: 'Ernesto Sábato', editorial: 'Sur', genero: 'Novela', anio: 1948 },
      { titulo: 'La tregua', autor: 'Mario Benedetti', editorial: 'Alfaguara', genero: 'Novela', anio: 1960 },
      { titulo: 'Pedro Páramo', autor: 'Juan Rulfo', editorial: 'Fondo de Cultura Económica', genero: 'Novela', anio: 1955 },
      { titulo: 'El llano en llamas', autor: 'Juan Rulfo', editorial: 'Fondo de Cultura Económica', genero: 'Cuento', anio: 1953 },
      { titulo: 'La metamorfosis', autor: 'Franz Kafka', editorial: 'Alianza', genero: 'Novela', anio: 1915 },
      { titulo: 'El extranjero', autor: 'Albert Camus', editorial: 'Gallimard', genero: 'Novela', anio: 1942 },
      { titulo: 'El viejo y el mar', autor: 'Ernest Hemingway', editorial: 'Scribner', genero: 'Novela', anio: 1952 },
      { titulo: 'Matar a un ruiseñor', autor: 'Harper Lee', editorial: 'HarperCollins', genero: 'Novela', anio: 1960 },
      { titulo: 'El guardián entre el centeno', autor: 'J.D. Salinger', editorial: 'Little, Brown', genero: 'Novela', anio: 1951 },
      { titulo: 'Cumbres borrascosas', autor: 'Emily Brontë', editorial: 'Thomas Cautley Newby', genero: 'Novela', anio: 1847 },
      { titulo: 'Jane Eyre', autor: 'Charlotte Brontë', editorial: 'Smith, Elder & Co.', genero: 'Novela', anio: 1847 },
      { titulo: 'El retrato de Dorian Gray', autor: 'Oscar Wilde', editorial: 'Lippincott', genero: 'Novela', anio: 1890 },
      { titulo: 'Drácula', autor: 'Bram Stoker', editorial: 'Archibald Constable', genero: 'Terror', anio: 1897 },
      { titulo: 'Frankenstein', autor: 'Mary Shelley', editorial: 'Lackington, Hughes', genero: 'Terror', anio: 1818 },
      { titulo: 'El conde de Montecristo', autor: 'Alexandre Dumas', editorial: 'Pétion', genero: 'Novela Histórica', anio: 1844 },
      { titulo: 'Los miserables', autor: 'Victor Hugo', editorial: 'A. Lacroix', genero: 'Novela Histórica', anio: 1862 },
      { titulo: 'La guerra de los mundos', autor: 'H.G. Wells', editorial: 'William Heinemann', genero: 'Ciencia Ficción', anio: 1898 },
      { titulo: 'Un mundo feliz', autor: 'Aldous Huxley', editorial: 'Chatto & Windus', genero: 'Ciencia Ficción', anio: 1932 },
      { titulo: 'Fahrenheit 451', autor: 'Ray Bradbury', editorial: 'Ballantine', genero: 'Ciencia Ficción', anio: 1953 },
      { titulo: 'El hombre invisible', autor: 'Ralph Ellison', editorial: 'Random House', genero: 'Novela', anio: 1952 },
      { titulo: 'La campana de cristal', autor: 'Sylvia Plath', editorial: 'Heinemann', genero: 'Novela', anio: 1963 },
      { titulo: 'El gran Gatsby', autor: 'F. Scott Fitzgerald', editorial: 'Scribner', genero: 'Novela', anio: 1925 },
      { titulo: 'Moby Dick', autor: 'Herman Melville', editorial: 'Harper & Brothers', genero: 'Novela', anio: 1851 },
      { titulo: 'Las uvas de la ira', autor: 'John Steinbeck', editorial: 'Viking', genero: 'Novela', anio: 1939 },
      { titulo: 'El cartero siempre llama dos veces', autor: 'James M. Cain', editorial: 'Knopf', genero: 'Novela Negra', anio: 1934 },
      { titulo: 'El sueño de los héroes', autor: 'Adolfo Bioy Casares', editorial: 'Sudamericana', genero: 'Novela', anio: 1954 },
      { titulo: 'La invención de Morel', autor: 'Adolfo Bioy Casares', editorial: 'Losada', genero: 'Ciencia Ficción', anio: 1940 },
      { titulo: 'El laberinto de la soledad', autor: 'Octavio Paz', editorial: 'Fondo de Cultura Económica', genero: 'Ensayo', anio: 1950 },
      { titulo: 'El amor, las mujeres y la vida', autor: 'Mario Benedetti', editorial: 'Alfaguara', genero: 'Poesía', anio: 1995 },
      { titulo: 'La ciudad y los perros', autor: 'Mario Vargas Llosa', editorial: 'Seix Barral', genero: 'Novela', anio: 1963 },
      { titulo: 'Conversación en La Catedral', autor: 'Mario Vargas Llosa', editorial: 'Seix Barral', genero: 'Novela', anio: 1969 },
      { titulo: 'La fiesta del chivo', autor: 'Mario Vargas Llosa', editorial: 'Alfaguara', genero: 'Novela Histórica', anio: 2000 },
      { titulo: 'Los detectives salvajes', autor: 'Roberto Bolaño', editorial: 'Anagrama', genero: 'Novela', anio: 1998 },
      { titulo: '2666', autor: 'Roberto Bolaño', editorial: 'Anagrama', genero: 'Novela', anio: 2004 },
      { titulo: 'La historia de la eternidad', autor: 'Jorge Luis Borges', editorial: 'Emecé', genero: 'Ensayo', anio: 1936 },
      { titulo: 'El Aleph', autor: 'Jorge Luis Borges', editorial: 'Emecé', genero: 'Cuento', anio: 1949 },
    ];

    const librosNuevos: Book[] = [];

    for (let i = 1; i <= 100; i++) {
      const base = librosBase[(i - 1) % librosBase.length];
      const padId = String(i).padStart(3, '0');
      const esRepeticion = i > librosBase.length;

      const libro = this.bookRepository.create({
        codigo: `LIB-${padId}`,
        titulo: esRepeticion ? `${base.titulo} (Ejemplar ${Math.floor((i - 1) / librosBase.length) + 1})` : base.titulo,
        autor: base.autor,
        editorial: base.editorial,
        genero: base.genero,
        anioPublicacion: base.anio,
        disponible: true,
      });

      librosNuevos.push(libro);
    }

    await this.bookRepository.save(librosNuevos);
    return { mensaje: '¡Se han inyectado 100 libros de prueba exitosamente!', insertados: 100 };
  }

  // 1. Crear un libro nuevo (con validación de código único)
  async create(createBookDto: CreateBookDto): Promise<Book> {
    const existe = await this.bookRepository.findOneBy({ codigo: createBookDto.codigo });
    if (existe) {
      throw new BadRequestException('El código interno de este libro ya está registrado');
    }

    const newBook = this.bookRepository.create(createBookDto);
    return await this.bookRepository.save(newBook);
  }

  // 2. Obtener todos los libros
  async findAll(): Promise<Book[]> {
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
  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(id);

    if (updateBookDto.codigo && updateBookDto.codigo !== book.codigo) {
      const existe = await this.bookRepository.findOneBy({ codigo: updateBookDto.codigo });
      if (existe) {
        throw new BadRequestException('El código interno ya pertenece a otro libro');
      }
    }

    const updatedBook = Object.assign(book, updateBookDto);
    return await this.bookRepository.save(updatedBook);
  }

  // 5. Eliminar un libro
  async remove(id: number): Promise<void> {
    const book = await this.findOne(id);
    await this.bookRepository.remove(book);
  }
}