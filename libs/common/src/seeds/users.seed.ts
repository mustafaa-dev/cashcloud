import { Injectable } from '@nestjs/common';
import { UsersService } from '@app/users/users.service';
import { RolesService } from '@app/roles/roles.service';
import { User } from '@app/users/entities';
import { Role } from '@app/roles/entities';

@Injectable()
export class UsersSeed {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
  ) {}

  async seedUsers() {
    const role: Role = await this.rolesService.getRoleBy({ name: 'admin' });
    const user: User = new User();
    user.name = 'Admin User';
    user.username = 'admin';
    user.email = 'admin@example.com';
    user.password = 'password';
    user.phone = '1234567890';
    user.active = true;
    user.isVerified = true;
    user.role = role;
    // return await this.usersService.addAdmin(user, null);
  }
}
