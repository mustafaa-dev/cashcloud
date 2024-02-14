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
import { PermissionService } from './permission.service';
import {
  AddPermissionDto,
  ApiResponse,
  PermissionQueryDto,
  sendSuccess,
  setPermissions,
} from '@app/common';
import { Permission } from './entities/permission.entity';
import { JwtGuard } from '@app/auth/guards/jwt.guard';

@Controller('permission')
@UseGuards(JwtGuard)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @setPermissions(['read_all_permissions'])
  async getPermissions(
    @Query() permissionQueryDto: PermissionQueryDto,
  ): Promise<Permission[]> {
    return await this.permissionService.getPermissions(permissionQueryDto);
  }

  @Post()
  @setPermissions(['add_permission'])
  async addPermission(
    @Body() addPermissionDto: AddPermissionDto,
  ): Promise<Permission> {
    return await this.permissionService.addPermission(addPermissionDto);
  }

  @Delete(':id')
  @setPermissions(['delete_permission'])
  async deletePermission(
    @Param('id') id: number,
  ): Promise<ApiResponse<string>> {
    await this.permissionService.deletePermission(id);
    return sendSuccess('Deleted');
  }

  @Get(':id')
  @setPermissions(['read_any_permission'])
  async getPermissionBy(@Param('id') id: number): Promise<Permission> {
    return await this.permissionService.getPermissionBy({ id });
  }

  @Patch(':id')
  @setPermissions(['edit_permission'])
  async editPermission(
    @Param('id') id: number,
    @Body() addPermissionDto: AddPermissionDto,
  ): Promise<Permission> {
    return await this.permissionService.editPermission(id, addPermissionDto);
  }
}
