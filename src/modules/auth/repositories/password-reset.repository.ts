import { AbstractRepository } from '@app/common';
import { PasswordReset } from '../entities/password-reset.entity';
import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PasswordResetRepository extends AbstractRepository<PasswordReset> {
  constructor(
    @InjectRepository(PasswordReset)
    passwordResetRepository: Repository<PasswordReset>,
    entityManager: EntityManager,
  ) {
    super(
      passwordResetRepository,
      entityManager,
      'Password Reset Session not found',
    );
  }
}
