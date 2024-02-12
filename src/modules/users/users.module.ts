import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from '@app/common';
import { AdminDetails, ClientDetails, User } from './entities';
import { ClientDetailsRepository, UserRepository } from './repositories';
import { AdminDetailsRepository } from './repositories/admin-details.repository';
import { LicensesModule } from '@app/license/licenses.module';
import { MediaModule } from '@app/media';
import { RolesModule } from '@app/roles/roles.module';

@Module({
  imports: [
    DatabaseModule.forFeature([User, AdminDetails, ClientDetails]),
    RolesModule,
    MediaModule,
    LicensesModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UserRepository,
    AdminDetailsRepository,
    ClientDetailsRepository,
  ],
  exports: [UsersService],
})
export class UsersModule {}
