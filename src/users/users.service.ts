import { Injectable, BadRequestException } from '@nestjs/common';
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

  async create(createUserDto: any) {
    // Verificamos si el email ya existe en la base de datos
    const userExists = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (userExists) {
      throw new BadRequestException('El correo ya está registrado');
    }

    // Encriptamos la contraseña (el número 10 es el nivel de seguridad)
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Creamos el nuevo usuario con la contraseña encriptada
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    // Guardamos en la base de datos de Railway
    return await this.userRepository.save(newUser);
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findAll() {
    return await this.userRepository.find();
  }
}