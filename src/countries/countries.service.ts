import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './entities/country.entity';
import { RestCountriesProvider } from './providers/rest-countries.provider';

/**
 * CountriesService — Servicio de uso INTERNO.
 * Implementa la lógica de caché local:
 *   1. Busca el país en la base de datos local.
 *   2. Si no existe, lo obtiene de la API externa y lo almacena.
 *   3. Retorna la entidad Country para que otros módulos la usen.
 *
 * Este servicio NO está expuesto por ningún controlador HTTP.
 */
@Injectable()
export class CountriesService {
  private readonly logger = new Logger(CountriesService.name);

  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    private readonly restCountriesProvider: RestCountriesProvider,
  ) {}

  /**
   * Resuelve un país por código Alpha-3.
   * Aplica la estrategia cache-aside:
   *   - HIT  → devuelve el registro local directamente.
   *   - MISS → consulta API externa, persiste, y devuelve.
   *
   * @param alpha3Code Código de 3 letras mayúsculas (ej. "COL")
   * @returns Entidad Country persistida en base de datos local
   */
  async resolveCountry(alpha3Code: string): Promise<Country> {
    const code = alpha3Code.toUpperCase();

    // 1. Buscar en caché local
    const cached = await this.countryRepository.findOne({
      where: { alpha3Code: code },
    });

    if (cached) {
      this.logger.log(`[CACHE HIT] País "${code}" encontrado en BD local.`);
      return cached;
    }

    // 2. Cache MISS → consultar API externa
    this.logger.log(`[CACHE MISS] País "${code}" no está en BD local. Consultando API externa...`);
    const remoteData = await this.restCountriesProvider.fetchByAlpha3(code);

    // 3. Persistir en caché local
    const country = this.countryRepository.create({
      alpha3Code: remoteData.alpha3Code.toUpperCase(),
      name: remoteData.name,
      region: remoteData.region,
      capital: remoteData.capital,
      population: remoteData.population,
      flagUrl: remoteData.flagUrl,
    });

    const saved = await this.countryRepository.save(country);
    this.logger.log(`[CACHE STORE] País "${code}" guardado en BD local.`);

    return saved;
  }
}
