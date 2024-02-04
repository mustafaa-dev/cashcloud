import { Injectable } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { Role } from '../entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class RoleRepository extends AbstractRepository<Role> {
  constructor(
    @InjectRepository(Role) roleRepository: Repository<Role>,
    entityManager: EntityManager,
  ) {
    super(roleRepository, entityManager, 'Role Not Found');
  }
}
