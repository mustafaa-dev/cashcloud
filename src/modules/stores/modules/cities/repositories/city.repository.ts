import { AbstractRepository } from '@app/common';
import { City } from '../entities/city.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

export class CityRepository extends AbstractRepository<City> {
  constructor(
    @InjectRepository(City) repository: Repository<City>,
    entityManager: EntityManager,
  ) {
    super(repository, entityManager, 'City Not Found');
  }
}
