import { BadRequestException, Injectable } from '@nestjs/common';
import { StoreTypeRepository } from '@app/stores/modules/store-types/repositories/store-type.repository';
import { AddStoreTypeDto } from '@app/common';
import { StoreType } from '@app/stores/modules/store-types/entites/store-types.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class StoreTypesService {
  constructor(private readonly storeTypeRepository: StoreTypeRepository) {}

  async addStoreType(addStoreTypeDto: AddStoreTypeDto) {
    if (
      await this.storeTypeRepository.checkOne({
        name: addStoreTypeDto.name.toLowerCase(),
      })
    )
      throw new BadRequestException('Already added');
    const newStoreType = new StoreType();
    Object.assign(newStoreType, {
      ...addStoreTypeDto,
      name: addStoreTypeDto.name.toLowerCase(),
    });
    return await this.storeTypeRepository.createOne(newStoreType);
  }

  async getStoreTypeBy(options: QueryDeepPartialEntity<StoreType>) {
    return await this.storeTypeRepository.findOne({ where: options });
  }
}
