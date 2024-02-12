import { AbstractRepository } from '@app/common';
import { Store } from '../entities/store.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

export class StoreRepository extends AbstractRepository<Store> {
  constructor(
    @InjectRepository(Store) repository: Repository<Store>,
    entityManager: EntityManager,
  ) {
    super(repository, entityManager, 'Store Not Found');
  }
}
