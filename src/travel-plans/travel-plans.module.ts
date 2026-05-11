import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TravelPlan } from './entities/travel-plan.entity';
import { TravelPlansService } from './travel-plans.service';
import { TravelPlansController } from './travel-plans.controller';
import { CountriesModule } from '../countries/countries.module';

/**
 * TravelPlansModule — módulo de interfaz pública.
 *
 * Importa CountriesModule para acceder a CountriesService
 * mediante inyección de dependencias, cumpliendo el encapsulamiento
 * requerido: los países nunca se consultan directamente por HTTP desde aquí.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([TravelPlan]),
    CountriesModule, // Permite inyectar CountriesService en TravelPlansService
  ],
  providers: [TravelPlansService],
  controllers: [TravelPlansController],
})
export class TravelPlansModule {}
