import { BadRequestException, Injectable } from '@nestjs/common';
import { StoreRepository } from '@app/stores/repositories/store.repository';
import { Store } from '@app/stores/entities';
import { StoreTypesService } from '@app/stores/modules/store-types/store-types.service';
import { AddStoreAdminDto } from '@app/common';
import { LicensesService } from '@app/license/licenses.service';
import { StoreType } from '@app/stores/modules/store-types/entites/store-types.entity';
import { License } from '@app/license/entities';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { GET_ALL_STORES_PAGINATION } from '@app/common/pagination/stores.pagination';
import { EntityManager } from 'typeorm';
import { Address } from '@app/modules/addresses/entities/address.entity';

@Injectable()
export class StoresService {
  constructor(
    private readonly storeRepository: StoreRepository,
    private readonly storeTypeService: StoreTypesService,
    private readonly licenseService: LicensesService,
    private readonly entityManager: EntityManager,
  ) {}

  async addStore(addStoreAdminDto: AddStoreAdminDto) {
    const newStore: Store = new Store();
    const newAddress = new Address();
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
    Object.assign(newAddress, addStoreAdminDto.address);
    return await this.entityManager.transaction(async (tr) => {
      newStore.store_type = storeType;
      newStore.owned_by = license;
      newStore.address = await tr.save(Address, addStoreAdminDto.address);
      return await tr.save(newStore);
    });
  }

  async getAllStores(query: PaginateQuery) {
    return paginate(
      query,
      this.storeRepository.createQueryBuilder('stores'),
      GET_ALL_STORES_PAGINATION,
    );
  }

  async deleteStore(id: number) {
    return await this.storeRepository.findOneAndDelete({ id });
  }
}
