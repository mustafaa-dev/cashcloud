import { AbstractRepository } from '@app/common';
import { ClientDetails } from '../entities/client-details.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

export class ClientDetailsRepository extends AbstractRepository<ClientDetails> {
  constructor(
    @InjectRepository(ClientDetails)
    clientDetailsRepository: Repository<ClientDetails>,
    entityManager: EntityManager,
  ) {
    super(clientDetailsRepository, entityManager, 'Client Details not found');
  }
}
