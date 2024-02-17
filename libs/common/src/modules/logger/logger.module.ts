import { Module } from '@nestjs/common';
import { LoggerModule as PinoLogger } from 'nestjs-pino';
import { LoggerService } from '@app/common/modules/logger/logger.service';

@Module({
  imports: [
    PinoLogger.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
  ],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
