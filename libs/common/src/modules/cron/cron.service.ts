import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class CronService {
  constructor(private readonly entityManager: EntityManager) {}

  // @Cron(CronExpression.EVERY_12_HOURS)
  // @Cron(CronExpression.EVERY_12_HOURS)
}
