import { Body, Controller, Post } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { AddAddressDto } from '@app/common';

@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  async addAddress(@Body() addAddressDto: AddAddressDto) {
    return await this.addressesService.addAddress(addAddressDto);
  }
}
