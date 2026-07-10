import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { LoansService } from './loans.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  // 1. POST /loans -> Para pedir un libro prestado
  @Post()
  create(@Body() createLoanDto: CreateLoanDto) {
    return this.loansService.create(createLoanDto);
  }

  // 2. GET /loans -> Ver la lista de todos los préstamos
  @Get()
  findAll() {
    return this.loansService.findAll();
  }

  // 3. GET /loans/:id -> Ver los detalles de un préstamo específico
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loansService.findOne(+id);
  }

  // 4. PATCH /loans/:id/return -> Solo el dueño del préstamo o personal de biblioteca puede devolver
  @UseGuards(JwtAuthGuard)
  @Patch(':id/return')
  returnBook(@Param('id') id: string, @Request() req: any) {
    return this.loansService.returnBook(+id, req.user);
  }
}