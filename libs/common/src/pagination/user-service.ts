import { Column } from 'nestjs-paginate/lib/helper';
import { User } from '../../../../src/modules/users/entities';
import { FilterOperator, FilterSuffix } from 'nestjs-paginate';

export const ADMIN_RELATIONS: Column<User>[] = [
  'role',
  'client_details',
  'admin_details',
  'picture',
  'client_details.license',
];

export const USER_RELATIONS: Column<User>[] = ['role', 'picture'];
export const ADMIN_SORTABLE_COLUMN: Column<User>[] = [
  'id',
  'name',
  'username',
  'active',
  'createdAt',
  'updatedAt',
];
export const USER_SORTABLE_COLUMN: Column<User>[] = ['id', 'name', 'username'];
export const ADMIN_SEARCHABLE: Column<User>[] = [
  'name',
  'username',
  'phone',
  'email',
  'phone',
  'active',
  'role.name',
  'client_details.license.code',
  'client_details.license.active',
];
export const USER_SEARCHABLE: Column<User>[] = ['name', 'username', 'phone'];

export const ADMIN_SELECTABLE: Column<User>[] = [
  'id',
  'name',
  'username',
  'email',
  'phone',
  'active',
  'role.name',
  'picture.secure_url',
  'client_details.id',
  'client_details.license.id',
  'client_details.license.code',
  'client_details.license.expiresAt',
  'picture',
  'createdAt',
  'updatedAt',
];
export const USER_SELECTABLE: Column<User>[] = [
  'id',
  'name',
  'username',
  'active',
  'role.name',
  'picture.secure_url',
];

export const ADMIN_FILTERABLE = {
  name: [FilterOperator.EQ, FilterSuffix.NOT],
  username: true,
  phone: true,
  email: true,
  'client_details.license.code': true,
  // admin_details: {
  //   is_super_admin: true,
  // },
};
