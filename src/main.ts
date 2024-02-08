import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.getOrThrow('PORT');
  app.enableCors();
  app.useLogger(app.get(Logger));
  app.setGlobalPrefix('api/v4');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  // app.useGlobalFilters(new ApiGatewayErrorFilter());
  await app.listen(PORT);
}

bootstrap().then();
