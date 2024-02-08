import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminAuthController } from './controllers/admin-auth.controller';
import { UsersAuthController } from './controllers/users-auth.controller';
import { UsersModule } from '../users/users.module';
import { VerificationRepository } from './repositories/verification.repository';
import { DatabaseModule, jwtConfig, RedisModule } from '@app/common';
import { Verification } from './entities/verification.entity';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './stratigies/auth.strategy';
import { JwtStrategy } from './stratigies/jwt.strategy';
import { PasswordReset } from './entities/password-reset.entity';
import { PasswordResetRepository } from './repositories/password-reset.repository';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    RedisModule,
    PassportModule,
    UsersModule,
    DatabaseModule,
    DatabaseModule.forFeature([Verification, PasswordReset]),
    JwtModule.registerAsync(jwtConfig),
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
