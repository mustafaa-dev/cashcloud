import { forwardRef, Module } from '@nestjs/common';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';
import { StoreTypesModule } from './modules/store-types/store-types.module';
import { DatabaseModule } from '@app/common';
import { Store } from '@app/stores/entities';
import { StoreRepository } from './repositories/store.repository';
import { LicensesModule } from '@app/license';
import { MediaModule } from '@app/media';
import { AddressesModule } from '@app/modules/addresses';
import { ProductsModule } from '@app/modules/products';

@Module({
  imports: [
    DatabaseModule.forFeature([Store]),
    MediaModule,
    AddressesModule,
    StoreTypesModule,
    LicensesModule,
    forwardRef(() => ProductsModule),
  ],
  controllers: [StoresController],
  providers: [StoresService, StoreRepository],
  exports: [StoresService],
})
export class StoresModule {}
