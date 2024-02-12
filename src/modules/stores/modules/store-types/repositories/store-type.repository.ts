import { AbstractRepository } from '@app/common';
import { StoreType } from '@app/stores/modules/store-types/entites/store-types.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

export class StoreTypeRepository extends AbstractRepository<StoreType> {
  constructor(
    @InjectRepository(StoreType) storeTypeRepository: Repository<StoreType>,
    entityManager: EntityManager,
  ) {
    super(storeTypeRepository, entityManager, 'Store Type Not Found');
  }
}
