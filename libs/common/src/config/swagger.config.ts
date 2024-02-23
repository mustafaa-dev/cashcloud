import { DocumentBuilder } from '@nestjs/swagger';

export const SWAGGER_CONFIG = new DocumentBuilder()
  .setTitle('Cashcloud API')
  .setDescription('Cashcloud API description')
  .setVersion('1.0')
  .setBasePath('api/v1')
  .addServer('http://localhost:9000/api/v1', 'Local')
  .setContact(
    'Mustafa',
    'https://github.com/mustafaa-dev',
    'mostafa.mohammed1235@gmail.com',
  )
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      description: `Please enter token in following format: JWT`,
      name: 'Authorization',
      bearerFormat: 'Bearer',
      in: 'Header',
    },
    'access-token',
  )
  .build();
