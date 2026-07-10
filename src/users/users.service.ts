import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 1. Crear / Registrar un nuevo usuario de forma segura
  async create(createUserDto: any): Promise<User> {
    const existingUser = await this.userRepository.findOneBy({ email: createUserDto.email });
    if (existingUser) {
      throw new BadRequestException('El correo electrónico ya está registrado en el sistema.');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

    const newUser = this.userRepository.create({
      nombre: createUserDto.nombre || createUserDto.nombreCompleto,
      email: createUserDto.email,
      password: hashedPassword,
      rol: createUserDto.rol || 'user',
    });

    return await this.userRepository.save(newUser);
  }

  // 2. Buscar un usuario por su Email (Requerido por AuthService)
  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ email });
  }

  // 3. Obtener todos los usuarios registrados (Sintaxis de select corregida a objeto booleano)
  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true
      } // 👈 Cambiado de arreglo a objeto para TypeORM moderno
    });
  }

  // 4. Obtener un usuario específico por su ID
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`El usuario con ID ${id} no existe.`);
    }
    return user;
  }

  // 5. Actualizar un usuario (Añadido para quitar el error del controlador)
  async update(id: number, updateUserDto: any): Promise<User> {
    const user = await this.findOne(id);
    
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = Object.assign(user, updateUserDto);
    return await this.userRepository.save(updatedUser);
  }

  // 6. Eliminar un usuario del sistema
  async remove(id: number): Promise<{ message: string }> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
    return { message: `Usuario con ID ${id} eliminado exitosamente.` };
  }
}