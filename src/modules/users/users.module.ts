import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from '@app/common';
import { AdminDetails, ClientDetails, User } from './entities';
import { ClientDetailsRepository, UserRepository } from './repositories';
import { MediaModule } from '../media/media.module';
import { RolesModule } from '../roles/roles.module';
import { AdminDetailsRepository } from './repositories/admin-details.repository';
import { LicensesModule } from '../licenses';

@Module({
  imports: [
    DatabaseModule.forFeature([User, AdminDetails, ClientDetails]),
    MediaModule,
    RolesModule,
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
