import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { CountriesModule } from './countries/countries.module';
import { TravelPlansModule } from './travel-plans/travel-plans.module';
import { UsersModule } from './users/users-module'; // <-- nuevo
import { Country } from './countries/entities/country.entity';
import { TravelPlan } from './travel-plans/entities/travel-plan.entity';
import { User } from './users/entities/user.entity'; // <-- nuevo

@Module({
  imports: [
    // Configuración de variables de entorno global
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Configuración de TypeORM con SQLite
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get<string>('DB_DATABASE', 'travel_plans.db'),
        entities: [Country, TravelPlan, User], // <-- incluye User
        synchronize: true, // En producción usar migraciones
        logging: false,
      }),
    }),

    CountriesModule,
    TravelPlansModule,
    UsersModule, // <-- importa el módulo de usuarios
    HttpModule,
  ],
})
export class AppModule {}
