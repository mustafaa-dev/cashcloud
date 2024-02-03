import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.getOrThrow('PORT');
  app.enableCors();
  app.useLogger(app.get(Logger));
  await app.listen(PORT);
}

bootstrap().then(() =>
  console.log(`Server is running on port ${process.env.PORT}`),
);
