import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository } from '@app/common/modules/database/repositories/abstract.repository';
import { EntityManager, Repository } from 'typeorm';
import { Address } from '../entities/address.entity';

export class AddressRepository extends AbstractRepository<Address> {
  constructor(
    @InjectRepository(Address) addressRepository: Repository<Address>,
    entityManager: EntityManager,
  ) {
    super(addressRepository, entityManager, 'Address not found');
  }
}
