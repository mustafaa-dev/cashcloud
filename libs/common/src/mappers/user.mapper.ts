import { User } from '../../../../src/modules/users/entities/user.entity';
import { RoleMapper } from '@app/common';

export class UserMapper {
  constructor() {}

  static mapUser(user: User) {
    let mappedUser: object = {};
    mappedUser = { ...user, role: RoleMapper.mapRole(user.role) };
    delete mappedUser['confirmPassword'];
    return mappedUser;
  }
}
