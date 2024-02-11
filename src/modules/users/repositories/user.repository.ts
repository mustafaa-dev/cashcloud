import { Injectable } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { User } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class UserRepository extends AbstractRepository<User> {
  constructor(
    @InjectRepository(User) userRepository: Repository<User>,
    entityManager: EntityManager,
  ) {
    super(userRepository, entityManager, 'User Not Found');
  }
}
