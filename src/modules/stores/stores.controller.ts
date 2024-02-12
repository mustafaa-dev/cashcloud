import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { StoresService } from '@app/stores/stores.service';
import { AddStoreAdminDto, setPermissions } from '@app/common';
import { JwtGuard, PermissionGuard } from '@app/auth/guards';

@Controller('stores')
export class StoresController {
  constructor(private readonly storeService: StoresService) {}

  @Post()
  @UseGuards(JwtGuard, PermissionGuard)
  @setPermissions(['add_any_store'])
  async addStore(@Body() addStoreAdminDto: AddStoreAdminDto) {
    return await this.storeService.addStore(addStoreAdminDto);
  }
}
