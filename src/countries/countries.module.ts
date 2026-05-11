import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { Country } from './entities/country.entity';
import { CountriesService } from './countries.service';
import { RestCountriesProvider } from './providers/rest-countries.provider';

/**
 * CountriesModule — Módulo de uso INTERNO.
 *
 * Responsabilidades:
 *  - Gestionar la entidad Country y su repositorio.
 *  - Exponer CountriesService para que otros módulos lo inyecten.
 *  - Encapsular el consumo de la API externa (RestCountriesProvider).
 *
 * IMPORTANTE: Este módulo NO declara ningún controlador.
 * No hay rutas HTTP públicas expuestas desde aquí.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Country]),
    HttpModule, // Para HttpService utilizado por RestCountriesProvider
  ],
  providers: [
    CountriesService,
    RestCountriesProvider, // Provider especializado para la API externa
  ],
  exports: [
    CountriesService, // Exportado para inyección en TravelPlansModule
  ],
  // controllers: []  ← Intencionalmente vacío. Sin endpoints HTTP públicos.
})
export class CountriesModule {}
