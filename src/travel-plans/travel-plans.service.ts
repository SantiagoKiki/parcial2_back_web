import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TravelPlan } from './entities/travel-plan.entity';
import { CreateTravelPlanDto } from './dto/create-travel-plan.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { CountriesService } from '../countries/countries.service';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';


@Injectable()
export class TravelPlansService {
  private readonly logger = new Logger(TravelPlansService.name);

  constructor(
    @InjectRepository(TravelPlan)
    private readonly travelPlanRepository: Repository<TravelPlan>,
    private readonly countriesService: CountriesService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateTravelPlanDto): Promise<TravelPlan> {
    const countryCode = dto.countryCode.toUpperCase();
    this.logger.log(`Creando plan de viaje: "${dto.title}" -> pais "${countryCode}"`);
    const country = await this.countriesService.resolveCountry(countryCode);
    const plan = this.travelPlanRepository.create({
      title: dto.title,
      startDate: dto.startDate,
      endDate: dto.endDate,
      countryCode: country.alpha3Code,
      expenses: [],
    });
    const saved = await this.travelPlanRepository.save(plan);
    this.logger.log(`Plan de viaje creado con ID: ${saved.id}`);
    return saved;
  }

  async findAll(): Promise<TravelPlan[]> {
    return this.travelPlanRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<TravelPlan> {
    const plan = await this.travelPlanRepository.findOne({ where: { id } });
    if (!plan) {
      throw new NotFoundException(`Plan de viaje con ID "${id}" no encontrado.`);
    }
    return plan;
  }

  async addExpense(id: string, dto: CreateExpenseDto): Promise<TravelPlan> {
    const plan = await this.findOne(id);
    if (!plan.expenses) {
      plan.expenses = [];
    }
    plan.expenses.push({
      description: dto.description,
      amount: dto.amount,
      category: dto.category,
    });
    const updated = await this.travelPlanRepository.save(plan);
    this.logger.log(`Gasto agregado al plan "${id}": ${dto.description} - $${dto.amount}`);
    return updated;
  }

  async remove(id: string): Promise<{ message: string }> {
    const plan = await this.findOne(id);
    await this.travelPlanRepository.remove(plan);
    this.logger.log(`Plan de viaje con ID "${id}" eliminado.`);
    return { message: `Plan de viaje "${plan.title}" eliminado exitosamente.` };
  }

  async createTravelPlan(dto: CreateUserDto): Promise<TravelPlan> {
  const user = await this.userRepository.findOne({ where: { id: dto.name } });// NO ME CORRIA :CCON ID NO SE QUE COSA HICE PERDON LO DEJE CON NOMBRE NO ME PEGUE PROFE
  if (!user) {
    throw new NotFoundException(`User with id ${dto.name} not found`);
  }

  const plan = this.travelPlanRepository.create({ ...dto, user });
  return this.travelPlanRepository.save(plan);
}
}
