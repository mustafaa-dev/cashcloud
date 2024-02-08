import { Module } from '@nestjs/common';
import { MailingController } from './mailing.controller';
import { MailingService } from './mailing.service';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    EventEmitterModule.forRoot(),
  ],
  controllers: [MailingController],
  providers: [MailingService],
})
export class MailingModule {}
