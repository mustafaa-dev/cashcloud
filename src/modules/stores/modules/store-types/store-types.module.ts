import { Module } from '@nestjs/common';
import { StoreTypesController } from './store-types.controller';
import { StoreTypesService } from './store-types.service';
import { DatabaseModule } from '@app/common';
import { StoreType } from './entites/store-types.entity';
import { StoreTypeRepository } from '@app/stores/modules/store-types/repositories/store-type.repository';

@Module({
  imports: [DatabaseModule.forFeature([StoreType])],
  controllers: [StoreTypesController],
  providers: [StoreTypesService, StoreTypeRepository],
  exports: [StoreTypesService],
})
export class StoreTypesModule {}
