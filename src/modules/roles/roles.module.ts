import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RoleRepository } from './repositories/role.repository';
import { RolesController } from './roles.controller';
import { DatabaseModule, LoggerModule } from '@app/common';
import { Role } from './entities/role.entity';
import { PermissionModule } from './permission/permission.module';

@Module({
  imports: [
    LoggerModule,
    DatabaseModule,
    DatabaseModule.forFeature([Role]),
    PermissionModule,
  ],
  providers: [RolesService, RoleRepository],
  controllers: [RolesController],
  exports: [RolesService],
})
export class RolesModule {}
