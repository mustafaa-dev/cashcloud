import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StoresService } from '@app/stores/stores.service';
import {
  AddStoreAdminDto,
  AddStoreDto,
  CurrentUser,
  LoggedInUserInterface,
  setPermissions,
  UpdateStoreAdminDto,
} from '@app/common';
import { JwtGuard, PermissionGuard } from '@app/auth/guards';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateStoreClientDto } from '@app/common/dtos/request/stores/update-store-client.dto';

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

  @Delete(':id')
  @UseGuards(JwtGuard, PermissionGuard)
  @setPermissions(['delete_any_store'])
  async deleteStore(
    @CurrentUser() user: LoggedInUserInterface,
    @Param('id') id: number,
  ) {
    return await this.storeService.deleteStore(+id);
  }

  @Patch('update-store-admin/:id')
  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(FileInterceptor('logo'))
  @setPermissions(['update_any_store'])
  async updateAnyStore(
    @CurrentUser() user: LoggedInUserInterface,
    @UploadedFile() image: Express.Multer.File,
    @Param('id') id: number,
    @Body() updateStoreDto: UpdateStoreAdminDto,
  ) {
    return await this.storeService.updateStore(+id, image, updateStoreDto);
  }

  @Patch('update-store-client/:id')
  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(FileInterceptor('logo'))
  @setPermissions(['update_own_store'])
  async updateOwnStore(
    @CurrentUser() user: LoggedInUserInterface,
    @UploadedFile() image: Express.Multer.File,
    @Param('id') id: number,
    @Body() updateStoreDto: UpdateStoreClientDto,
  ) {
    return await this.storeService.updateStore(+id, image, updateStoreDto);
  }
}
