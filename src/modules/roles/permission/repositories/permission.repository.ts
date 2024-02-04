import { Injectable } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';

@Injectable()
export class PermissionRepository extends AbstractRepository<Permission> {
  constructor(
    @InjectRepository(Permission) permissionRepository: Repository<Permission>,
    entityManager: EntityManager,
  ) {
    super(permissionRepository, entityManager, 'Permission Not Found');
  }
}
