import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApiGatewayErrorFilter } from '@app/common';
import { LoggerService } from '@app/common/modules/logger/logger.service';

async function bootstrap() {
  const app: INestApplication<AppModule> = await NestFactory.create(AppModule);
  // console.log(SpelunkerModule.explore(app));
  //SWAGGER UI
  const config = new DocumentBuilder()
    .setTitle('Cashcloud API')
    .setDescription('Cashcloud API description')
    .setVersion('4.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  // END SWAGGER UI
  const configService = app.get(ConfigService);
  const PORT = configService.getOrThrow('PORT');
  app.enableCors();
  const loggerService = app.get(LoggerService);
  app.useLogger(app.get(Logger));
  app.setGlobalPrefix('api/v4');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new ApiGatewayErrorFilter(loggerService));
  await app.listen(PORT);
}

bootstrap().then();
