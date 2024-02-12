import { AbstractRepository } from '@app/common';
import { License } from '../entities/license.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

export class LicenseRepository extends AbstractRepository<License> {
  constructor(
    @InjectRepository(License) licenceRepository: Repository<License>,
    entityManager: EntityManager,
  ) {
    super(licenceRepository, entityManager, 'License not found');
  }
}
