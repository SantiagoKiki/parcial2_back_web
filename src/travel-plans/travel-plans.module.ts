// travel-plans.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TravelPlansService } from './travel-plans.service';
import { TravelPlansController } from './travel-plans.controller';
import { TravelPlan } from './entities/travel-plan.entity';
import { Country } from '../countries/entities/country.entity';
import { User } from '../users/entities/user.entity';
import { CountriesModule } from '../countries/countries.module';
import { UsersModule } from '../users/users-module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TravelPlan, Country, User]), 
    CountriesModule,
    UsersModule, 
  ],
  controllers: [TravelPlansController],
  providers: [TravelPlansService],
})
export class TravelPlansModule {}
