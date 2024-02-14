import { Role } from '@app/roles/entities';
import { DataSource, EntityManager } from 'typeorm';
import {
  seedAdminPermissions,
  seedClientPermissions,
  seedEmployeePermissions,
} from '@app/common/seeds/permissions.seed';
import { Permission } from '@app/roles/permission/entities';

export async function seedRoles(dataSource: DataSource) {
  console.log('Seeding roles');
  await dataSource.manager.transaction(
    async (transactionalEntityManager: EntityManager) => {
      const existingRole = await transactionalEntityManager.find(Role);
      if (existingRole.length > 0) {
        console.log(`Roles already seeded`);
        return;
      }
      console.log('Seeding admin role');
      console.log('------------------');
      const adminRole: Role = await seedAdmin(dataSource);

      console.log('Seeding client role');
      console.log('------------------');
      const clientRole: Role = await seedClient(dataSource);
      console.log('Seeding employee role');
      console.log('------------------');
      const employeeRole: Role = await seedEmployee(dataSource);

      await transactionalEntityManager.save(adminRole);
      await transactionalEntityManager.save(clientRole);
      await transactionalEntityManager.save(employeeRole);
      console.log('Roles seeded');

      // for (const role of roles) {
      //   const newRole: Role = new Role();
      //   newRole.name = role;
      //   await transactionalEntityManager.save(newRole);
      //   for (const permission of permissions) {
      //     newRole.has.push(permission);
      //   }
      // }
    },
  );
}

async function seedAdmin(dataSource: DataSource) {
  const permissions: Permission[] = await seedAdminPermissions(dataSource);
  const newRole: Role = new Role();
  newRole.name = 'admin';
  newRole.has = permissions;
  return newRole;
}

async function seedClient(dataSource: DataSource) {
  const permissions: Permission[] = await seedClientPermissions(dataSource);
  const newRole: Role = new Role();
  newRole.name = 'client';
  newRole.has = permissions;
  return newRole;
}

async function seedEmployee(dataSource: DataSource) {
  const permissions: Permission[] = await seedEmployeePermissions(dataSource);
  const newRole: Role = new Role();
  newRole.name = 'employee';
  newRole.has = permissions;
  return newRole;
}
