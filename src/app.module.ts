import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { LoggerModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import { AdminAuthController } from './modules/auth/controllers/admin-auth.controller';
import { UsersAuthController } from './modules/auth/controllers/users-auth.controller';
import { UsersController } from './modules/users/users.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: './.env' }),
    LoggerModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AdminAuthController, UsersAuthController, UsersController],
  providers: [],
})
export class AppModule {}
