import { Permission } from '@app/roles/permission/entities';
import { DataSource, EntityManager } from 'typeorm';

export const admin_permissions = [
  'read_any_license',
  'read_all_licenses',
  'change_any_license_status',
  'change_any_license_stores_number',
  'extend_license',
  'read_extend_license',
  'add_role',
  'read_any_role',
  'delete_role',
  'edit_role',
  'add_permission_to_role',
  'delete_permission_from_role',
  'read_all_permissions',
  'add_permission',
  'delete_permission',
  'read_any_permission',
  'edit_permission',
  'add_any_store',
  'view_all_stores',
  'delete_any_store',
  'update_any_store',
  'add_store_type',
  'add_client_user',
  'read_all_users',
  'read_own_user',
  'read_any_user',
  'delete_client_user',
  'delete_employee_user',
  'add_any_product',
  'delete_any_product',
];
export const client_permissions = [
  'read_own_license',
  'change_own_license_status',
  'read_extend_license',
  'add_own_store',
  'update_own_store',
  'read_own_user',
];
export const employee_permissions = [];

export async function seedPermissions(dataSource: DataSource) {
  console.log('Seeding permissions');
  await dataSource.manager.transaction(
    async (transactionalEntityManager: EntityManager) => {
      const existingPermissions =
        await transactionalEntityManager.find(Permission);
      if (existingPermissions) {
        console.log(`Permissions already seeded`);
        return;
      }

      for (const permission of client_permissions) {
        const newPermission: Permission = new Permission();
        newPermission.name = permission;
        await transactionalEntityManager.save(permission);
      }
      console.log('Client Permissions seeded');
      console.log('------------------');

      for (const permission of employee_permissions) {
        const newPermission: Permission = new Permission();
        newPermission.name = permission;
        await transactionalEntityManager.save(permission);
      }
      console.log('Employee Permissions seeded');
      console.log('------------------');
    },
  );
}

export async function seedAdminPermissions(dataSource: DataSource) {
  console.log('Seeding Admin permissions');

  return await dataSource.manager.transaction(
    async (transactionalEntityManager: EntityManager) => {
      const per: Permission[] = [];

      const existingPermissions =
        await transactionalEntityManager.find(Permission);
      if (existingPermissions.length > 0) {
        console.log(`Permissions already seeded`);
        return;
      }
      for (const permission of admin_permissions) {
        const newPermission: Permission = new Permission();
        newPermission.name = permission;
        per.push(newPermission);

        await transactionalEntityManager.save(newPermission);
      }
      console.log('Admin Permissions seeded');
      console.log('------------------');
      return per;
    },
  );
}

export async function seedClientPermissions(dataSource: DataSource) {
  console.log('Seeding Client permissions');
  const per: Permission[] = [];
  return await dataSource.manager.transaction(
    async (transactionalEntityManager: EntityManager) => {
      for (const permission of client_permissions) {
        const newPermission: Permission = new Permission();
        newPermission.name = permission;
        per.push(newPermission);
        await transactionalEntityManager.save(newPermission);
      }
      console.log('Client Permissions seeded');
      console.log('------------------');
      return per;
    },
  );
}

export async function seedEmployeePermissions(dataSource: DataSource) {
  console.log('Seeding Employee permissions');

  return await dataSource.manager.transaction(
    async (transactionalEntityManager: EntityManager) => {
      const per: Permission[] = [];
      for (const permission of employee_permissions) {
        const newPermission: Permission = new Permission();
        newPermission.name = permission;
        per.push(newPermission);
        await transactionalEntityManager.save(newPermission);
      }
      console.log('Employee Permissions seeded');
      console.log('------------------');
      return per;
    },
  );
}
