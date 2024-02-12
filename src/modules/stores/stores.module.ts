import { forwardRef, Module } from '@nestjs/common';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';
import { CitiesModule } from './modules/cities/cities.module';
import { StoreTypesModule } from './modules/store-types/store-types.module';
import { DatabaseModule } from '@app/common';
import { Store } from '@app/stores/entities';
import { StoreRepository } from './repositories/store.repository';
import { LicensesModule } from '@app/license/licenses.module';

@Module({
  imports: [
    DatabaseModule.forFeature([Store]),
    CitiesModule,
    StoreTypesModule,
    forwardRef(() => LicensesModule),
  ],
  controllers: [StoresController],
  providers: [StoresService, StoreRepository],
})
export class StoresModule {}
