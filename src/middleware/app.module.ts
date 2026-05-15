// app.module.ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuditMiddleware } from './audit.middleware';
import { UsersModule } from 'src/users/users-module';
import { TravelPlansModule } from 'src/travel-plans/travel-plans.module';

@Module({
  imports: [UsersModule, TravelPlansModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuditMiddleware)
      .forRoutes('users', 'travel-plans');
  }
}
