import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminAuthController } from './controllers/admin-auth.controller';
import { UsersAuthController } from './controllers/users-auth.controller';

@Module({
  providers: [AuthService],
  controllers: [AdminAuthController, UsersAuthController],
  exports: [AuthService],
})
export class AuthModule {}
