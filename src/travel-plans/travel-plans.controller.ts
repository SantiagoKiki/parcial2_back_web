import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TravelPlansService } from './travel-plans.service';
import { CreateTravelPlanDto } from './dto/create-travel-plan.dto';

/**
 * TravelPlansController — único punto de entrada HTTP público.
 *
 * Endpoints disponibles:
 *   POST   /travel-plans         → Crear plan de viaje
 *   GET    /travel-plans         → Listar todos los planes
 *   GET    /travel-plans/:id     → Detalle de un plan por ID
 *   DELETE /travel-plans/:id     → Eliminar un plan por ID
 */
@Controller('travel-plans')
export class TravelPlansController {
  constructor(private readonly travelPlansService: TravelPlansService) {}

  /**
   * POST /travel-plans
   * Crea un nuevo plan de viaje. Valida el país destino contra la API
   * externa (o la caché local) antes de persistir.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTravelPlanDto: CreateTravelPlanDto) {
    return this.travelPlansService.create(createTravelPlanDto);
  }

  /**
   * GET /travel-plans
   * Retorna todos los planes de viaje registrados, ordenados por fecha de creación.
   */
  @Get()
  findAll() {
    return this.travelPlansService.findAll();
  }

  /**
   * GET /travel-plans/:id
   * Retorna el detalle de un plan de viaje específico.
   * Usa ParseUUIDPipe para validar que el :id sea un UUID válido.
   */
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.travelPlansService.findOne(id);
  }

  /**
   * DELETE /travel-plans/:id
   * Elimina un plan de viaje. Devuelve 200 con mensaje de confirmación.
   */
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.travelPlansService.remove(id);
  }
}
