import { AbstractRepository } from '@app/common';
import { Verification } from '../entities/verification.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VerificationRepository extends AbstractRepository<Verification> {
  constructor(
    @InjectRepository(Verification)
    verificationRepository: Repository<Verification>,
    entityManager: EntityManager,
  ) {
    super(
      verificationRepository,
      entityManager,
      'Verification Session not found',
    );
  }
}
