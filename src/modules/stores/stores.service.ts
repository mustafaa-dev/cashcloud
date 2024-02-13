import { BadRequestException, Injectable } from '@nestjs/common';
import { StoreRepository } from '@app/stores/repositories/store.repository';
import { Store } from '@app/stores/entities';
import { StoreTypesService } from '@app/stores/modules/store-types/store-types.service';
import { AddStoreAdminDto } from '@app/common';
import { LicensesService } from '@app/license/licenses.service';
import { StoreType } from '@app/stores/modules/store-types/entites/store-types.entity';
import { License } from '@app/license/entities';

@Injectable()
export class StoresService {
  constructor(
    private readonly storeRepository: StoreRepository,
    private readonly storeTypeService: StoreTypesService,
    private readonly licenseService: LicensesService,
  ) {}

  async addStore(addStoreAdminDto: AddStoreAdminDto) {
    const newStore: Store = new Store();
    const storeType: StoreType = await this.storeTypeService.getStoreTypeBy({
      id: addStoreAdminDto.storeTypeId,
    });
    const license: License = await this.licenseService.getLicenseBy({
      code: addStoreAdminDto.licenseCode,
    });
    if (!(license.no_of_stores - license.stores.length))
      throw new BadRequestException('License Limit Reached');
    delete addStoreAdminDto.storeTypeId;
    delete addStoreAdminDto.licenseCode;
    Object.assign(newStore, addStoreAdminDto);
    newStore.store_type = storeType;
    newStore.owned_by = license;
    return await this.storeRepository.createOne(newStore);
  }
}
