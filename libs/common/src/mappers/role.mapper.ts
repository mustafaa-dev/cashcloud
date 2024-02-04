import { Role } from '../../../../src/modules/roles/entities/role.entity';
import { PermissionMapper } from '@app/common/mappers/permission.mapper';

export class RoleMapper extends PermissionMapper {
  static mapRoles(roles: Role[]) {
    const result = [];
    roles.forEach((role: Role) => {
      result.push(this.mapRole(role));
    });
    return result;
  }

  static mapRole(role: Role) {
    return {
      id: role.id,
      name: role.name,
      permissions: this.mapPermissions(role.has),
    };
  }
}
