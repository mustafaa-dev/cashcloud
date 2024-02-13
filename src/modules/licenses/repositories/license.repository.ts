import { AbstractRepository } from '@app/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { License } from '@app/license/entities';

export class LicenseRepository extends AbstractRepository<License> {
  constructor(
    @InjectRepository(License)
    licenceRepository: Repository<License>,
    entityManager: EntityManager,
  ) {
    super(licenceRepository, entityManager, 'License not found');
  }
}
