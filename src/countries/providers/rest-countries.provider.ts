import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

/**
 * Provider especializado para consumir la API externa RestCountries.
 * Encapsula toda la comunicación HTTP con el servicio externo,
 * aislando al CountriesService de los detalles de la API.
 */
@Injectable()
export class RestCountriesProvider {
  private readonly logger = new Logger(RestCountriesProvider.name);
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>(
      'REST_COUNTRIES_API',
      'https://restcountries.com/v3.1',
    );
  }

  /**
   * Busca un país por su código Alpha-3 en la API externa.
   * @param alpha3Code Código Alpha-3 del país (ej. "COL")
   * @returns Datos crudos del país normalizados
   */
  async fetchByAlpha3(alpha3Code: string): Promise<{
    alpha3Code: string;
    name: string;
    region: string;
    capital: string;
    population: number;
    flagUrl: string;
  }> {
    const url = `${this.baseUrl}/alpha/${alpha3Code.toLowerCase()}`;
    this.logger.log(`Consultando API externa: ${url}`);

    try {
      const response = await firstValueFrom(this.httpService.get(url));
      const data = response.data;

      // La API devuelve un array; tomamos el primer elemento
      const countryRaw = Array.isArray(data) ? data[0] : data;

      if (!countryRaw) {
        throw new NotFoundException(
          `País con código Alpha-3 "${alpha3Code}" no encontrado en la API externa.`,
        );
      }

      // Normalizar la respuesta de la API v3.1 de RestCountries
      return {
        alpha3Code: countryRaw.cca3 as string,
        name: countryRaw.name?.common ?? countryRaw.name?.official ?? 'Desconocido',
        region: countryRaw.region ?? null,
        capital: Array.isArray(countryRaw.capital)
          ? countryRaw.capital[0]
          : countryRaw.capital ?? null,
        population: countryRaw.population ?? 0,
        flagUrl: countryRaw.flags?.png ?? countryRaw.flags?.svg ?? null,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      // Error HTTP (404, 500, red, etc.)
      const status = error?.response?.status;
      if (status === 404){
        throw new NotFoundException(
          `País con código Alpha-3 "${alpha3Code}" no existe en RestCountries.`,
        );
      }

      this.logger.error(
        `Error al consultar RestCountries para "${alpha3Code}": ${error.message}`,
      );
      throw new Error(
        `No se pudo obtener información del país "${alpha3Code}" desde la API externa.`,
      );
    }
  }
}
