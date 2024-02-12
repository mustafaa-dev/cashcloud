import { Module } from '@nestjs/common';

import { DatabaseModule } from '@app/common';
import { PermissionModule } from '@app/roles/permission/permission.module';
import { RolesService } from '@app/roles/roles.service';
import { Role } from '@app/roles/entities';
import { RoleRepository } from '@app/roles/repositories';
import { RolesController } from '@app/roles/roles.controller';

@Module({
  imports: [DatabaseModule.forFeature([Role]), PermissionModule],
  providers: [RolesService, RoleRepository],
  controllers: [RolesController],
  exports: [RolesService],
})
export class RolesModule {}
