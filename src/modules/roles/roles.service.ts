import { BadRequestException, Injectable } from '@nestjs/common';
import { RoleRepository } from './repositories/role.repository';
import {
  AddRoleDto,
  ApiResponse,
  GetRoleByDto,
  RoleMapper,
  RoleQueryDto,
  sendSuccess,
} from '@app/common';
import { Role } from './entities/role.entity';
import { PermissionService } from './permission/permission.service';
import { Permission } from './permission/entities/permission.entity';

@Injectable()
export class RolesService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly permissionService: PermissionService,
  ) {}

  async addRole(addRoleDto: AddRoleDto): Promise<Role> {
    const newRole: Role = new Role();
    Object.assign(newRole, addRoleDto);
    if (await this.roleRepository.checkOne({ name: addRoleDto.name }))
      throw new BadRequestException('Already Added');
    return await this.roleRepository.create(newRole);
  }

  async getRoles(roleQueryDto: RoleQueryDto): Promise<Role[]> {
    const roles: Role[] = await this.roleRepository.find(roleQueryDto);
    return RoleMapper.mapRoles(roles);
  }

  async getRoleBy(getRoleByDto: GetRoleByDto): Promise<Role> {
    return await this.roleRepository.findOne({
      where: { ...getRoleByDto },
    });
  }

  async deleteRole(id: number): Promise<ApiResponse<string>> {
    await this.roleRepository.findOneAndDelete({ id });
    return sendSuccess('Deleted');
  }

  async editRole(id: number, addRoleDto: AddRoleDto): Promise<Role> {
    return await this.roleRepository.findOneAndUpdate({ id }, addRoleDto);
  }

  async addPermissionToRole(
    roleId: number,
    permissionId: number,
  ): Promise<Role> {
    const { role, permission, found } = await this.searchPermissionInRole(
      roleId,
      permissionId,
    );
    if (found.length) throw new BadRequestException('Already Added');

    role.has.push(permission);
    return await this.roleRepository.create(role);
  }

  async removePermissionFromRole(
    roleId: number,
    permissionId: number,
  ): Promise<Role> {
    const { role, permission, found } = await this.searchPermissionInRole(
      roleId,
      permissionId,
    );
    if (!found.length) throw new BadRequestException('Already Removed');

    role.has.splice(role.has.indexOf(permission) - 1, 1);
    return await this.roleRepository.create(role);
  }

  async searchPermissionInRole(roleId: number, permissionId: number) {
    const role: Role = await this.getRoleBy({ id: roleId });
    const permission: Permission = await this.permissionService.getPermissionBy(
      {
        id: permissionId,
      },
    );
    const found = role.has.filter((per: Permission): boolean => {
      return per.name === permission.name;
    });
    return { role, permission, found };
  }
}
