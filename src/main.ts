import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { ValidationPipe } from '@nestjs/common';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { LoggerService } from '@app/common/modules/logger/logger.service';
import { ApiGatewayErrorFilter, SWAGGER_CONFIG } from '@app/common';
import { join } from 'path';

async function bootstrap() {
  const app: any = await NestFactory.create(AppModule);
  // console.log(SpelunkerModule.explore(app));

  //SWAGGER UI
  const document: OpenAPIObject = SwaggerModule.createDocument(
    app,
    SWAGGER_CONFIG,
  );
  SwaggerModule.setup('api-docs', app, document);
  // END SWAGGER UI
  const configService = app.get(ConfigService);
  const PORT = configService.getOrThrow('PORT');
  const loggerService = app.get(LoggerService);

  app.enableCors();
  app.useLogger(app.get(Logger));
  // app.enableVersioning({ type: VersioningType.URI });
  app.setGlobalPrefix('api/v1', { exclude: ['/'] });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new ApiGatewayErrorFilter(loggerService));
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    index: false,
    prefix: '/public',
  });
  await app.listen(PORT);
}

bootstrap().then();
