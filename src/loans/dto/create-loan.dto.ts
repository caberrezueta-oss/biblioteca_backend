import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class CreateLoanDto {
  @IsNumber()
  @IsNotEmpty({ message: 'El ID del usuario es obligatorio.' })
  userId!: number;

  @IsNumber()
  @IsNotEmpty({ message: 'El ID del libro es obligatorio.' })
  bookId!: number;

  @IsString()
  @IsNotEmpty({ message: 'Debe registrar qué documento se entrega como garantía.' })
  documentoEntregado!: string;
}