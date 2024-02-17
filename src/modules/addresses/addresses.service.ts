import { BadRequestException, Injectable } from '@nestjs/common';
import { AddressRepository } from './repositories/address.repository';
import { AddAddressDto } from '@app/common';
import { Address } from './entities/address.entity';

@Injectable()
export class AddressesService {
  constructor(private readonly addressRepository: AddressRepository) {}

  async addAddress(addAddressDto: AddAddressDto) {
    if (
      await this.addressRepository.checkOne({
        latitude: addAddressDto.latitude,
        longitude: addAddressDto.longitude,
      })
    )
      throw new BadRequestException('Address already exists');
    const newAddress = new Address();
    Object.assign(newAddress, addAddressDto);
    return await this.addressRepository.createOne(newAddress);
  }

  async getAddressById(id: number) {
    return await this.addressRepository.findOne({ where: { id } });
  }
}
