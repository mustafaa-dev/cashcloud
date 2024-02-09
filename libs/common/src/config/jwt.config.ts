import { ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt/dist/interfaces/jwt-module-options.interface';

export const jwtConfig: JwtModuleAsyncOptions = {
  useFactory: async (configService: ConfigService) => ({
    algorithm: 'RS256',
    issuer: 'cashcloud',
    signOptions: {
      expiresIn: `${configService.getOrThrow<string>('JWT_EXPIRATION')}`,
    },
  }),
  inject: [ConfigService],
};
