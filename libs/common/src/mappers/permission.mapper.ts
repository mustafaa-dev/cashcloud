import { Permission } from '../../../../src/modules/roles/permission/entities/permission.entity';

export class PermissionMapper {
  constructor(private readonly permission: Permission) {}

  static mapPermissions(permissions: Permission[]) {
    const result = [];
    permissions.forEach((permission: Permission) => {
      result.push({ id: permission.id, name: permission.name });
    });
    return result;
  }

  static mapPermission(permission: Permission) {
    const result = [];
    result.push({ id: permission.id, name: permission.name });
    return result;
  }
}
