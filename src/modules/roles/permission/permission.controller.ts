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
} from '@app/common';
import { Permission } from './entities/permission.entity';
import { JwtGuard } from '../../auth/guards/jwt.guard';

@Controller('permission')
@UseGuards(JwtGuard)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  async getPermissions(
    @Query() permissionQueryDto: PermissionQueryDto,
  ): Promise<Permission[]> {
    return await this.permissionService.getPermissions(permissionQueryDto);
  }

  @Post()
  async addPermission(
    @Body() addPermissionDto: AddPermissionDto,
  ): Promise<Permission> {
    return await this.permissionService.addPermission(addPermissionDto);
  }

  @Delete(':id')
  async deletePermission(
    @Param('id') id: number,
  ): Promise<ApiResponse<string>> {
    await this.permissionService.deletePermission(id);
    return sendSuccess('Deleted');
  }

  @Get(':id')
  async getPermissionBy(@Param('id') id: number): Promise<Permission> {
    return await this.permissionService.getPermissionBy({ id });
  }

  @Patch(':id')
  async editPermission(
    @Param('id') id: number,
    @Body() addPermissionDto: AddPermissionDto,
  ): Promise<Permission> {
    return await this.permissionService.editPermission(id, addPermissionDto);
  }
}
