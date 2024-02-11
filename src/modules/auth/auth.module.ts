import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminAuthController } from './controllers/admin-auth.controller';
import { UsersAuthController } from './controllers/users-auth.controller';
import { UsersModule } from '../users/users.module';
import { jwtConfig, RedisModule } from '@app/common';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './stratigies/auth.strategy';
import { JwtStrategy } from './stratigies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    RedisModule,
    PassportModule,
    UsersModule,
    JwtModule.registerAsync(jwtConfig),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AdminAuthController, UsersAuthController],
  exports: [AuthService],
})
export class AuthModule {}
