import { ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt/dist/interfaces/jwt-module-options.interface';

export const jwtConfig: JwtModuleAsyncOptions = {
  useFactory: (configService: ConfigService) => ({
    secret: configService.getOrThrow<string>('JWT_SECRET'),
    signOptions: {
      expiresIn: `${configService.getOrThrow<number>('JWT_EXPIRATION')}`,
    },
  }),
  inject: [ConfigService],
};
