import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { LoggerService } from '@app/common/modules/logger/logger.service';
import { ApiGatewayErrorFilter, SWAGGER_CONFIG } from '@app/common';

async function bootstrap() {
  const app: INestApplication<AppModule> = await NestFactory.create(AppModule);
  // console.log(SpelunkerModule.explore(app));
  //SWAGGER UI

  const document = SwaggerModule.createDocument(app, SWAGGER_CONFIG);
  SwaggerModule.setup('api-docs', app, document);
  // END SWAGGER UI
  const configService = app.get(ConfigService);
  const PORT = configService.getOrThrow('PORT');
  app.enableCors();
  const loggerService = app.get(LoggerService);
  app.useLogger(app.get(Logger));
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new ApiGatewayErrorFilter(loggerService));
  await app.listen(PORT);
}

bootstrap().then();
