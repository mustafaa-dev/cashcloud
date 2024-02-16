import dataSource from '@app/common/modules/database/config/data-source';
import { seedRoles } from '@app/common/seeds/roles.seed';
import { seedAdmins } from '@app/common/seeds/users.seed';
import { seedStoreTypes } from '@app/common/seeds/store-types.seed';

async function seed() {
  console.log('Seeding database');
  console.log('------------------');
  const ds = await dataSource.initialize();
  await seedRoles(ds);
  console.log('------------------');
  await seedAdmins(ds);
  console.log('------------------');
  await seedStoreTypes(ds);
  console.log('------------------');
}

seed()
  .then(() => {
    console.log('Database seeded');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error seeding database', error);
    console.error('Error details', error.stack);
    process.exit(1);
  });
