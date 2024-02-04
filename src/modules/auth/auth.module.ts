import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminAuthController } from './controllers/admin-auth.controller';
import { UsersAuthController } from './controllers/users-auth.controller';
import { UsersModule } from '../users/users.module';
import { VerificationRepository } from './repositories/verification.repository';
import { DatabaseModule } from '@app/common';
import { Verification } from './entities/verification.entity';

@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    DatabaseModule.forFeature([Verification]),
  ],
  providers: [AuthService, VerificationRepository],
  controllers: [AdminAuthController, UsersAuthController],
  exports: [AuthService],
})
export class AuthModule {}
