import { PaginateConfig } from 'nestjs-paginate';

export const PRODUCTS_PAGINATION: PaginateConfig<any> = {
  sortableColumns: ['id', 'name', 'price', 'createdAt', 'updatedAt'],
  relations: { photo: true, store: { products: { photo: true } } },
  searchableColumns: ['name', 'code', 'price', 'store.name'],
  filterableColumns: {
    'store.id': true,
    listed: true,
    discount: true,
    discount_value: true,
    discount_percentage: true,
    createdAt: true,
  },
  defaultSortBy: [['createdAt', 'DESC']],
  defaultLimit: 10,
};
