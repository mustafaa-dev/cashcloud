import { PaginateConfig } from 'nestjs-paginate';
import { Store } from '@app/stores/entities';

export const GET_ALL_STORES_PAGINATION: PaginateConfig<Store> = {
  relations: {
    store_type: true,
    owned_by: true,
    address: true,
  },
  sortableColumns: ['active', 'createdAt', 'name'],
  defaultSortBy: [['createdAt', 'DESC']],
  searchableColumns: [
    'name',
    'phone',
    'address.city',
    'address.state',
    'active',
    'store_type.name',
    'owned_by.license_code',
  ],
  // select: select,
  filterableColumns: { active: true, store_type: true, owned_by: true },
};
