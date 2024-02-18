import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class CronService {
  constructor(private readonly entityManager: EntityManager) {}

  // @Cron(CronExpression.EVERY_SECOND)
  // async x() {
  //   console.log('This is a cron job');
  // }

  // @Cron(CronExpression.EVERY_12_HOURS)
}
