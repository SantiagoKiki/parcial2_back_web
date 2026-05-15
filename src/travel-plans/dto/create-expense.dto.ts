import { IsString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

/**
 * DTO para agregar un gasto individual a un plan de viaje existente.
 * Valida que amount sea positivo y que description no este vacio.
 */
export class CreateExpenseDto {
  @IsString({ message: 'La descripcion debe ser texto.' })
  @IsNotEmpty({ message: 'La descripcion no puede estar vacia.' })
  description: string;

  @IsNumber({}, { message: 'El monto debe ser un numero.' })
  @IsPositive({ message: 'El monto debe ser un valor positivo mayor a 0.' })
  amount: number;

  @IsString({ message: 'La categoria debe ser texto.' })
  @IsNotEmpty({ message: 'La categoria no puede estar vacia.' })
  category: string;
}
