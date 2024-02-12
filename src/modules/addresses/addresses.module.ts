import { Module } from '@nestjs/common';
import { AddressesController } from './addresses.controller';
import { AddressesService } from './addresses.service';
import { AddressRepository } from './repositories/address.repository';
import { Address } from './entities/address.entity';
import { DatabaseModule } from '@app/common';

@Module({
  imports: [DatabaseModule.forFeature([Address])],
  controllers: [AddressesController],
  providers: [AddressesService, AddressRepository],
  exports: [AddressesService],
})
export class AddressesModule {}
