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
 * Validador personalizado: endDate > startDate
 */
@ValidatorConstraint({ name: 'isEndDateAfterStartDate', async: false })
export class IsEndDateAfterStartDate implements ValidatorConstraintInterface {
  validate(endDate: string, args: ValidationArguments): boolean {
    const obj = args.object as any;
    if (!obj.startDate || !endDate) return true;

    return new Date(endDate) > new Date(obj.startDate);
  }

  defaultMessage(): string {
    return 'La fecha de fin (endDate) debe ser posterior a la fecha de inicio (startDate).';
  }
}

/**
 * DTO para crear un Plan de Viaje
 */
export class CreateTravelPlanDto {

  @IsString({ message: 'userId debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El userId es obligatorio.' })
  userId: string;

  @IsString({ message: 'El título debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El título no puede estar vacío.' })
  title: string;

  @IsNotEmpty({ message: 'La fecha de inicio es obligatoria.' })
  @IsDateString({ strict: true }, { 
    message: 'startDate debe tener formato de fecha válida (YYYY-MM-DD).' 
  })
  startDate: string;

  @IsNotEmpty({ message: 'La fecha de fin es obligatoria.' })
  @IsDateString({ strict: true }, { 
    message: 'endDate debe tener formato de fecha válida (YYYY-MM-DD).' 
  })
  @Validate(IsEndDateAfterStartDate)
  endDate: string;

  @IsNotEmpty({ message: 'El código del país (countryCode) es obligatorio.' })
  @IsString({ message: 'countryCode must be a string' })
  @Length(3, 3, { 
    message: 'countryCode debe tener exactamente 3 caracteres (código Alpha-3).' 
  })
  @Matches(/^[A-Za-z]{3}$/, {
    message: 'countryCode debe contener solo letras (ej. "COL", "USA", "fra").'
  })
  countryCode: string;
}