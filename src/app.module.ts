import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import {
  CronModule,
  DatabaseModule,
  LoggerModule,
  RedisModule,
} from '@app/common';
import { ConfigModule } from '@nestjs/config';
import { RolesModule } from './modules/roles/roles.module';
import { MediaModule } from './modules/media/media.module';
import { MailingModule } from './modules/mailing/mailing.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: './.env' }),
    LoggerModule,
    RedisModule,
    CronModule,
    AuthModule,
    UsersModule,
    RolesModule,
    MediaModule,
    MailingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
