import { Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { DatabaseModule } from '@app/common';
import { Permission } from './entities/permission.entity';
import { PermissionRepository } from '@app/roles/permission/repositories/permission.repository';

@Module({
  imports: [DatabaseModule.forFeature([Permission])],
  controllers: [PermissionController],
  providers: [PermissionService, PermissionRepository],
  exports: [PermissionService],
})
export class PermissionModule {}
