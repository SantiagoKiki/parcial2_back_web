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
import { CreateExpenseDto } from './dto/create-expense.dto';

@Controller('travel-plans')
export class TravelPlansController {
  constructor(private readonly travelPlansService: TravelPlansService) {}

  // POST /travel-plans
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTravelPlanDto: CreateTravelPlanDto) {
    return this.travelPlansService.create(createTravelPlanDto);
  }

  // GET /travel-plans
  @Get()
  findAll() {
    return this.travelPlansService.findAll();
  }

  // GET /travel-plans/:id — incluye lista actualizada de gastos embebidos
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.travelPlansService.findOne(id);
  }

  // POST /travel-plans/:id/expenses — agrega un gasto al plan existente
  @Post(':id/expenses')
  @HttpCode(HttpStatus.CREATED)
  addExpense(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createExpenseDto: CreateExpenseDto,
  ) {
    return this.travelPlansService.addExpense(id, createExpenseDto);
  }

  // DELETE /travel-plans/:id
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.travelPlansService.remove(id);
  }
}
