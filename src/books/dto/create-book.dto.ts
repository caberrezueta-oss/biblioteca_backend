import { IsString, IsNumber, IsNotEmpty, IsBoolean, IsOptional, Max } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty({ message: 'El código interno es obligatorio' })
  codigo!: string;

  @IsString()
  @IsNotEmpty({ message: 'El título es obligatorio' })
  titulo!: string;

  @IsString()
  @IsNotEmpty({ message: 'El autor es obligatorio' })
  autor!: string;

  @IsString()
  @IsNotEmpty({ message: 'La editorial es obligatoria' })
  editorial!: string;

  @IsString()
  @IsNotEmpty({ message: 'El género es obligatorio' })
  genero!: string;

  @IsNumber()
  @IsNotEmpty({ message: 'El año de publicación es obligatorio' })
  @Max(2026) // Validando con el año actual del sistema
  anioPublicacion!: number;

  @IsBoolean()
  @IsOptional()
  disponible?: boolean;
}