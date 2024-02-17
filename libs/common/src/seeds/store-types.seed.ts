import { DataSource, EntityManager } from 'typeorm';
import { StoreType } from '@app/stores/modules/store-types/entites/store-types.entity';

export const STORE_TYPES = [
  ['shoes', '500'],
  ['clothes', '500'],
  ['playground', '500'],
  ['pharmacy', '500'],
];

export async function seedStoreTypes(dataSource: DataSource) {
  console.log('Seeding store types');
  await dataSource.manager.transaction(
    async (transactionalEntityManager: EntityManager) => {
      const existingStoreTypes =
        await transactionalEntityManager.find(StoreType);
      if (existingStoreTypes.length > 0) {
        console.log(`store types already seeded`);
        return;
      }

      for (const type of STORE_TYPES) {
        const newType: StoreType = new StoreType();
        newType.name = type[0];
        newType.cost = +type[1];
        await transactionalEntityManager.save(newType);
      }
      console.log('store types seeded');
      console.log('------------------');
    },
  );
}
