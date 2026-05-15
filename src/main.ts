import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,          // Elimina campos no declarados en el DTO
      forbidNonWhitelisted: true, // Lanza error si llegan campos extra
      transform: true,          // Transforma tipos automáticamente (ej. string -> Date)
    }),
  );

  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(` Travel Plans API corriendo en: http://localhost:${port}`);
  console.log(` Endpoints disponibles:`);
  console.log(`   POST   /travel-plans`);
  console.log(`   GET    /travel-plans`);
  console.log(`   GET    /travel-plans/:id`);
  console.log(`   DELETE /travel-plans/:id`);
}
bootstrap();
