import { BadRequestException, Injectable } from '@nestjs/common';
import { PermissionRepository } from './repositories/permission.repository';
import {
  AddPermissionDto,
  ApiResponse,
  FindPermissionByDto,
  PermissionMapper,
  PermissionQueryDto,
  sendSuccess,
} from '@app/common';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionService {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async getPermissions(
    permissionQueryDto: PermissionQueryDto,
  ): Promise<Permission[]> {
    console.log(permissionQueryDto);
    const permissions: Permission[] =
      await this.permissionRepository.find(permissionQueryDto);
    return PermissionMapper.mapPermissions(permissions);
  }

  async addPermission(addPermissionDto: AddPermissionDto): Promise<Permission> {
    const newPermission = new Permission();
    Object.assign(newPermission, addPermissionDto);
    if (
      await this.permissionRepository.checkOne({ name: addPermissionDto.name })
    )
      throw new BadRequestException('Already Added');
    return await this.permissionRepository.create(newPermission);
  }

  async deletePermission(id: number): Promise<ApiResponse<string>> {
    await this.permissionRepository.findOneAndDelete({ id });
    return sendSuccess('Deleted');
  }

  async getPermissionBy(
    findPermissionBy: FindPermissionByDto,
  ): Promise<Permission> {
    return await this.permissionRepository.findOne({
      where: { ...findPermissionBy },
    });
  }

  async editPermission(
    id: number,
    update: AddPermissionDto,
  ): Promise<Permission> {
    return await this.permissionRepository.findOneAndUpdate({ id }, update);
  }
}
