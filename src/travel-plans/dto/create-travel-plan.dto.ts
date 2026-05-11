import {
  IsString,
  IsNotEmpty,
  IsDateString,
  Length,
  Matches,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

/**
 * Validador personalizado: la fecha de fin debe ser posterior a la de inicio.
 */
@ValidatorConstraint({ name: 'isEndDateAfterStartDate', async: false })
export class IsEndDateAfterStartDate implements ValidatorConstraintInterface {
  validate(endDate: string, args: ValidationArguments): boolean {
    const obj = args.object as CreateTravelPlanDto;
    if (!obj.startDate || !endDate) return true; // Otras validaciones capturan los vacíos
    return new Date(endDate) > new Date(obj.startDate);
  }

  defaultMessage(): string {
    return 'La fecha de fin (endDate) debe ser posterior a la fecha de inicio (startDate).';
  }
}

/**
 * DTO para la creación de un plan de viaje.
 * Todos los campos son obligatorios y validados.
 */
export class CreateTravelPlanDto {
  @IsString({ message: 'El título debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El título no puede estar vacío.' })
  title: string;

  /**
   * Fecha en formato ISO 8601: YYYY-MM-DD
   * Ejemplo: "2025-06-15"
   */
  @IsNotEmpty({ message: 'La fecha de inicio es obligatoria.' })
  @IsDateString({}, { message: 'startDate debe tener formato de fecha válida (YYYY-MM-DD).' })
  startDate: string;

  @IsNotEmpty({ message: 'La fecha de fin es obligatoria.' })
  @IsDateString({}, { message: 'endDate debe tener formato de fecha válida (YYYY-MM-DD).' })
  @Validate(IsEndDateAfterStartDate)
  endDate: string;

  /**
   * Código Alpha-3 del país destino (exactamente 3 letras, mayúsculas o minúsculas).
   * El servicio lo normalizará a mayúsculas internamente.
   * Ejemplos válidos: "COL", "USA", "FRA", "col"
   */
  @IsNotEmpty({ message: 'El código del país (countryCode) es obligatorio.' })
  @IsString()
  @Length(3, 3, { message: 'countryCode debe tener exactamente 3 caracteres (código Alpha-3).' })
  @Matches(/^[a-zA-Z]{3}$/, {
    message: 'countryCode debe contener solo letras (ej. "COL", "USA").',
  })
  countryCode: string;
}
