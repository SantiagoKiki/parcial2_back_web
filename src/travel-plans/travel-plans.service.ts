import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TravelPlan } from './entities/travel-plan.entity';
import { CreateTravelPlanDto } from './dto/create-travel-plan.dto';
import { CountriesService } from '../countries/countries.service';

/**
 * TravelPlansService — lógica de negocio para gestión de planes de viaje.
 *
 * Integración con CountriesService:
 *   Antes de persistir un plan, se invoca resolveCountry() para garantizar
 *   que el país existe (en caché local o en la API externa).
 *   Esto previene guardar planes con códigos de país inválidos.
 */
@Injectable()
export class TravelPlansService {
  private readonly logger = new Logger(TravelPlansService.name);

  constructor(
    @InjectRepository(TravelPlan)
    private readonly travelPlanRepository: Repository<TravelPlan>,
    private readonly countriesService: CountriesService,
  ) {}

  /**
   * Crea un nuevo plan de viaje.
   * Flujo:
   *   1. Valida y resuelve el país destino (caché o API externa).
   *   2. Persiste el plan con la referencia al país.
   *   3. Retorna el plan creado con los datos del país embebidos.
   */
  async create(dto: CreateTravelPlanDto): Promise<TravelPlan> {
    const countryCode = dto.countryCode.toUpperCase();

    this.logger.log(`Creando plan de viaje: "${dto.title}" → país "${countryCode}"`);

    // Paso 1: Resolver país (dispara caché o API externa)
    const country = await this.countriesService.resolveCountry(countryCode);

    // Paso 2: Crear entidad TravelPlan
    const plan = this.travelPlanRepository.create({
      title: dto.title,
      startDate: dto.startDate,
      endDate: dto.endDate,
      countryCode: country.alpha3Code,
    });

    // Paso 3: Persistir
    const saved = await this.travelPlanRepository.save(plan);
    this.logger.log(`Plan de viaje creado con ID: ${saved.id}`);

    return saved;
  }

  /**
   * Lista todos los planes de viaje registrados,
   * incluyendo los datos del país destino (eager loaded).
   */
  async findAll(): Promise<TravelPlan[]> {
    return this.travelPlanRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Obtiene el detalle de un plan de viaje por su ID (UUID).
   * @throws NotFoundException si no se encuentra
   */
  async findOne(id: string): Promise<TravelPlan> {
    const plan = await this.travelPlanRepository.findOne({ where: { id } });

    if (!plan) {
      throw new NotFoundException(`Plan de viaje con ID "${id}" no encontrado.`);
    }

    return plan;
  }

  /**
   * Elimina un plan de viaje por su ID.
   * @throws NotFoundException si no se encuentra
   */
  async remove(id: string): Promise<{ message: string }> {
    const plan = await this.findOne(id); // lanza NotFoundException si no existe

    await this.travelPlanRepository.remove(plan);
    this.logger.log(`Plan de viaje con ID "${id}" eliminado.`);

    return { message: `Plan de viaje "${plan.title}" eliminado exitosamente.` };
  }
}
