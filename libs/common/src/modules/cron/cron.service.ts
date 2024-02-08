import { Injectable } from '@nestjs/common';
import { EntityManager, LessThan } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Verification } from '../../../../../src/modules/auth/entities/verification.entity';
import { PasswordReset } from '../../../../../src/modules/auth/entities/password-reset.entity';

@Injectable()
export class CronService {
  constructor(private readonly entityManager: EntityManager) {}

  @Cron(CronExpression.EVERY_12_HOURS)
  async deleteVerificationCode(): Promise<void> {
    return this.entityManager.transaction(async (transaction) => {
      const conditions: object = {
        codeExpiration: LessThan(new Date()),
      };
      await transaction.delete(Verification, conditions);
      console.log('Expired Verification Sessions Deleted Successfully');
    });
  }

  @Cron(CronExpression.EVERY_12_HOURS)
  async deleteResetPasswordCodes(): Promise<void> {
    return this.entityManager.transaction(async (transaction) => {
      const conditions: object = {
        passwordResetExpiration: LessThan(new Date()),
      };
      await transaction.delete(PasswordReset, conditions);
      console.log('Expired Reset Password Sessions Deleted Successfully');
    });
  }
}
