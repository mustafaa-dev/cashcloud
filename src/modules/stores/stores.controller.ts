import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { StoresService } from '@app/stores/stores.service';
import {
  AddStoreAdminDto,
  AddStoreDto,
  CurrentUser,
  LoggedInUserInterface,
  setPermissions,
} from '@app/common';
import { JwtGuard, PermissionGuard } from '@app/auth/guards';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

@Controller('stores')
export class StoresController {
  constructor(private readonly storeService: StoresService) {}

  @Post('add-store-admin')
  @UseGuards(JwtGuard, PermissionGuard)
  @setPermissions(['add_any_store'])
  async addStoreForAdmins(@Body() addStoreAdminDto: AddStoreAdminDto) {
    return await this.storeService.addStore(addStoreAdminDto);
  }

  @Post('add-store-client')
  @UseGuards(JwtGuard, PermissionGuard)
  @setPermissions(['add_own_store'])
  async addStoreForClients(
    @Body() addStoreDto: AddStoreDto,
    @CurrentUser() user: LoggedInUserInterface,
  ) {
    return await this.storeService.addStore({
      ...addStoreDto,
      licenseCode: user.client_details.license.code,
    });
  }

  @Get()
  @UseGuards(JwtGuard, PermissionGuard)
  @setPermissions(['view_all_stores'])
  async getAllStores(@Paginate() query: PaginateQuery) {
    return await this.storeService.getAllStores(query);
  }
}
