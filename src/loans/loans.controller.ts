import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { LoansService } from './loans.service';

@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  // POST /loans -> Para pedir un libro prestado
  @Post()
  create(@Body() createLoanDto: any) {
    return this.loansService.create(createLoanDto);
  }

  // GET /loans -> Ver la lista de todos los préstamos
  @Get()
  findAll() {
    return this.loansService.findAll();
  }

  // GET /loans/:id -> Ver los detalles de un préstamo específico
  @Get(':id') // 👈 ¡ESTO CORRIGE EL ERROR!
  findOne(@Param('id') id: string) {
    return this.loansService.findOne(+id);
  }

  // PATCH /loans/:id/return -> Marcar un libro como devuelto
  @Patch(':id/return')
  returnBook(@Param('id') id: string) {
    return this.loansService.returnBook(+id);
  }
}