import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 1. POST /users -> Registrar un usuario
  @Post()
  create(@Body() createUserDto: any) {
    return this.usersService.create(createUserDto);
  }

  // 2. GET /users -> Obtener todos los usuarios para la tabla (sin passwords)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // 3. PATCH /users/:id -> Actualizar datos del usuario (¡Aquí cambia el rol usando tu DTO!)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  // 4. DELETE /users/:id -> Eliminar un usuario
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}