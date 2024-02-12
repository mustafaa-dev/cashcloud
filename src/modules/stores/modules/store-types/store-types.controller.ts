import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { StoreTypesService } from '@app/stores/modules/store-types/store-types.service';
import { AddStoreTypeDto, setPermissions } from '@app/common';
import { JwtGuard, PermissionGuard } from '@app/auth/guards';

@Controller('store-types')
export class StoreTypesController {
  constructor(private readonly storeTypesService: StoreTypesService) {}

  @Post()
  @setPermissions(['add_store_type'])
  @UseGuards(JwtGuard, PermissionGuard)
  async addStoreType(@Body() addStoreTypeDto: AddStoreTypeDto) {
    return await this.storeTypesService.addStoreType(addStoreTypeDto);
  }
}
