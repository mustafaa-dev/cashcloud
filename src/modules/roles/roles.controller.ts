import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { AddRoleDto, Public, RoleQueryDto, setPermissions } from '@app/common';
import { Role } from '@app/roles/entities';
import { JwtGuard } from '@app/auth/guards/jwt.guard';

@Controller('roles')
@UseGuards(JwtGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @Public()
  async getRoles(@Query() query: RoleQueryDto): Promise<Role[]> {
    return await this.rolesService.getRoles(query);
  }

  @Get(':id')
  @setPermissions(['read_any_role'])
  async getRoleBy(@Param('id') id: number): Promise<Role> {
    return await this.rolesService.getRoleBy({ id });
  }

  @Post()
  @setPermissions(['add_role'])
  async addRole(@Body() addRoleDto: AddRoleDto): Promise<Role> {
    return await this.rolesService.addRole(addRoleDto);
  }

  @Delete(':id')
  @setPermissions(['delete_role'])
  async deleteRole(@Param('id') id: number) {
    return await this.rolesService.deleteRole(id);
  }

  @Patch(':id')
  @setPermissions(['edit_role'])
  async editRole(@Param('id') id: number, @Body() addRoleDto: AddRoleDto) {
    return await this.rolesService.editRole(id, addRoleDto);
  }

  @Post(':roleId/:permissionId')
  @setPermissions(['add_permission_to_role'])
  async addPermissionToRole(
    @Param('roleId') roleId: number,
    @Param('permissionId') permissionId: number,
  ): Promise<Role> {
    return await this.rolesService.addPermissionToRole(roleId, permissionId);
  }

  @Patch(':roleId/:permissionId')
  @setPermissions(['delete_permission_from_role'])
  async removePermissionFromRole(
    @Param('roleId') roleId: number,
    @Param('permissionId') permissionId: number,
  ): Promise<Role> {
    return await this.rolesService.removePermissionFromRole(
      roleId,
      permissionId,
    );
  }
}
