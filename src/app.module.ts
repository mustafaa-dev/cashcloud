import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule, LoggerModule, RedisModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import { MailingModule } from './modules/mailing/mailing.module';
import { LicensesModule } from './modules/licenses/licenses.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: './.env' }),
    LoggerModule,
    RedisModule,
    // CronModule,
    AuthModule,
    UsersModule,
    // RolesModule,
    // MediaModule,
    MailingModule,
    LicensesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
