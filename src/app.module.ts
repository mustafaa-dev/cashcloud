import { Module } from '@nestjs/common';
import { DatabaseModule, LoggerModule, RedisModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import { MailingModule } from '@app/mailing';
import { PaymentsModule } from '@app/payments';
import { StoresModule } from '@app/stores/stores.module';
import { AuthModule } from '@app/auth';
import { UsersModule } from '@app/users';
import { MediaModule } from '@app/media';
import { AddressesModule } from './modules/addresses';
import { LicensesModule } from '@app/license';
import { ProductsModule } from '@app/modules/products/products.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: './.env' }),
    LoggerModule,
    MailingModule,
    RedisModule,
    MediaModule,
    LicensesModule,
    AuthModule,
    UsersModule,
    PaymentsModule,
    StoresModule,
    AddressesModule,
    ProductsModule,
    // CronModule,
  ],
})
export class AppModule {}
