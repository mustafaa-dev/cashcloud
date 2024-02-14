import { DataSource, EntityManager } from 'typeorm';
import { Role } from '@app/roles/entities';
import { AdminDetails, User } from '@app/users/entities';

export async function seedAdmins(dataSource: DataSource) {
  console.log('Seeding Super Admins');
  console.log('------------------');
  await dataSource.manager.transaction(
    async (transactionalEntityManager: EntityManager) => {
      const role: Role = await transactionalEntityManager.findOne(Role, {
        where: { name: 'admin' },
      });
      const { superAdmin, superAdminDetails } = await seedSuperAdmin(role);
      await transactionalEntityManager.save(superAdminDetails);
      await transactionalEntityManager.save(superAdmin);
      console.log(`Super Admins seeded - ${superAdmin.username} : desha`);
      // return await this.usersService.addAdmin(user, null);

      const { user, adminDetails } = await seedAdmin(role);
      await transactionalEntityManager.save(adminDetails);
      await transactionalEntityManager.save(user);
      console.log(`Admin seeded - ${user.username} : desha`);
    },
  );
}

async function seedSuperAdmin(role: Role) {
  const superAdminDetails: AdminDetails = new AdminDetails();
  const user = new User();
  superAdminDetails.is_super_admin = true;
  user.name = 'Mustafa Muhammed';
  user.username = 'super_desha';
  user.email = 'mostafa.mohammed1235@gmail.com';
  user.password = 'desha';
  user.phone = '+201112658502';
  user.active = true;
  user.isVerified = true;
  user.role = role;
  user.admin_details = superAdminDetails;
  return { superAdmin: user, superAdminDetails };
}

async function seedAdmin(role: Role) {
  const adminDetails: AdminDetails = new AdminDetails();
  const user = new User();
  adminDetails.is_super_admin = false;
  user.name = 'Mustafa Muhammed';
  user.username = 'desha';
  user.email = 'mostafa.mohammed1235@icloud.com';
  user.password = 'desha';
  user.phone = '+21554444247';
  user.active = true;
  user.isVerified = true;
  user.role = role;
  user.admin_details = adminDetails;
  user.twoFA = 'OI3EYYSOLJ2XS62QJJATGWZFGVGUU3RR';
  return { user, adminDetails };
}
