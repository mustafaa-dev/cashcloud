import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from '@app/common';
import { LoggerModule } from 'nestjs-pino';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { MediaModule } from '../media/media.module';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([User]),
    LoggerModule,
    MediaModule,
    RolesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService],
})
export class UsersModule {}
