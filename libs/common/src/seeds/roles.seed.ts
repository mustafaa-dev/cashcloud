import { Injectable } from '@nestjs/common';
import { Role } from '@app/roles/entities';
import { EntityManager } from 'typeorm';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';

@Injectable()
export class RolesSeed {
  constructor(
    @Inject(EntityManager) private readonly entityManager: EntityManager,
  ) {}

  async seedRoles() {
    const roles = ['admin', 'client', 'employee', 'customer'];
    console.log('Seeding roles');
    return await this.entityManager.transaction(async (transaction) => {
      for (const role of roles) {
        const newRole: Role = new Role();
        newRole.name = role;
        await transaction.save(newRole);
      }
      console.log('Roles seeded');
    });
  }
}
