import { Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { DatabaseModule } from '@app/common';
import { Permission } from './entities/permission.entity';
import { PermissionRepository } from './repositories/permission.repository';

@Module({
  imports: [DatabaseModule, DatabaseModule.forFeature([Permission])],
  controllers: [PermissionController],
  providers: [PermissionService, PermissionRepository],
  exports: [PermissionService],
})
export class PermissionModule {}
