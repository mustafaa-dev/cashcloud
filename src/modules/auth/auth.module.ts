import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminAuthController } from './controllers/admin-auth.controller';
import { UsersAuthController } from './controllers/users-auth.controller';
import { UsersModule } from '../users/users.module';
import { VerificationRepository } from './repositories/verification.repository';
import { DatabaseModule } from '@app/common';
import { Verification } from './entities/verification.entity';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './stratigies/auth.strategy';
import { JwtStrategy } from './stratigies/jwt.strategy';
import { PasswordReset } from './entities/password-reset.entity';
import { PasswordResetRepository } from './repositories/password-reset.repository';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ session: true }),
    UsersModule,
    DatabaseModule,
    DatabaseModule.forFeature([Verification, PasswordReset]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.getOrThrow<number>('JWT_EXPIRATION')}`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    VerificationRepository,
    PasswordResetRepository,
    LocalStrategy,
    JwtStrategy,
  ],
  controllers: [AdminAuthController, UsersAuthController],
  exports: [AuthService],
})
export class AuthModule {}
