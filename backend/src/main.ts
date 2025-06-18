import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  const PORT = process.env.PORT ?? 4000;
  await app.listen(PORT);

  console.log(`App is listening 🦻 on port ⚓️: ${PORT}`);
}
bootstrap();
