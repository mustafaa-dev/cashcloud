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
import { MediaService } from '@app/media/media.service';
import { AddressesService } from '@app/modules/addresses/addresses.service';
import { UpdateStoreClientDto } from '@app/common/dtos/request/stores/update-store-client.dto';

@Injectable()
export class StoresService {
  constructor(
    private readonly storeRepository: StoreRepository,
    private readonly storeTypeService: StoreTypesService,
    private readonly licenseService: LicensesService,
    private readonly entityManager: EntityManager,
    private readonly mediaService: MediaService,
    private readonly addressService: AddressesService,
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

  async updateStore(
    id: number,
    image: Express.Multer.File,
    updateStoreAdminDto: UpdateStoreClientDto,
  ): Promise<Store> {
    const store: Store = await this.storeRepository.findOne({
      where: { id },
      relations: ['owned_by'],
    });
    const address = await this.addressService.getAddressById(store.address.id);
    return await this.entityManager.transaction(async (tr) => {
      Object.assign(store, updateStoreAdminDto);
      if (image) {
        const logo = await this.mediaService.uploadPicture(image);
        await tr.save(logo);
        store.logo = logo;
      }
      Object.assign(address, updateStoreAdminDto.address);
      await tr.save(address);
      return await tr.save(store);
    });
  }

  async getStoreById(id: number): Promise<Store> {
    return await this.storeRepository.findOne({
      where: { id },
      relations: ['store_type', 'address', 'owned_by'],
    });
  }
}
