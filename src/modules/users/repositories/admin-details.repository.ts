import { AbstractRepository } from '@app/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminDetails } from '../entities';

export class AdminDetailsRepository extends AbstractRepository<AdminDetails> {
  constructor(
    @InjectRepository(AdminDetails)
    adminDetailsRepository: Repository<AdminDetails>,
    entityManager: EntityManager,
  ) {
    super(adminDetailsRepository, entityManager, 'Admin Details not found');
  }
}
