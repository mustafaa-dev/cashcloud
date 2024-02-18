import { AbstractRepository } from '@app/common/modules/database/repositories/abstract.repository';
import { Store } from '@app/stores/entities';
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
