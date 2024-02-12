import { Injectable } from '@nestjs/common';
import { StoreRepository } from '@app/stores/repositories/store.repository';
import { Store } from '@app/stores/entities';
import { StoreTypesService } from '@app/stores/modules/store-types/store-types.service';
import { AddStoreAdminDto } from '@app/common';
import { LicensesService } from '@app/license/licenses.service';

@Injectable()
export class StoresService {
  constructor(
    private readonly storeRepository: StoreRepository,
    private readonly storeTypeService: StoreTypesService,
    private readonly licenseService: LicensesService,
  ) {}

  async addStore(addStoreAdminDto: AddStoreAdminDto) {
    const newStore = new Store();
    const storeType = await this.storeTypeService.getStoreTypeBy({
      id: addStoreAdminDto.storeTypeId,
    });
    // const license = await this.licenseService.getLicenseBy({
    //   code: addStoreAdminDto.licenseCode,
    // });
    delete addStoreAdminDto.storeTypeId;
    delete addStoreAdminDto.licenseCode;
    // return await this.storeRepository.createOne(newStore);
    Object.assign(newStore, addStoreAdminDto);
    newStore.store_type = storeType;
    // newStore.license = license;

    return newStore;
  }
}
