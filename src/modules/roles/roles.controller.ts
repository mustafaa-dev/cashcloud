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
import { AddRoleDto, Public, RoleQueryDto } from '@app/common';
import { Role } from './entities/role.entity';
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
  async getRoleBy(@Param('id') id: number): Promise<Role> {
    return await this.rolesService.getRoleBy({ id });
  }

  @Post()
  async addRole(@Body() addRoleDto: AddRoleDto): Promise<Role> {
    return await this.rolesService.addRole(addRoleDto);
  }

  @Delete(':id')
  async deleteRole(@Param('id') id: number) {
    return await this.rolesService.deleteRole(id);
  }

  @Patch(':id')
  async editRole(@Param('id') id: number, @Body() addRoleDto: AddRoleDto) {
    return await this.rolesService.editRole(id, addRoleDto);
  }

  @Post(':roleId/:permissionId')
  async addPermissionToRole(
    @Param('roleId') roleId: number,
    @Param('permissionId') permissionId: number,
  ): Promise<Role> {
    return await this.rolesService.addPermissionToRole(roleId, permissionId);
  }

  @Patch(':roleId/:permissionId')
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
