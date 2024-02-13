import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtGuard } from '@app/auth/guards/jwt.guard';
import { LicensesService } from './licenses.service';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { License } from './entities/license.entity';
import {
  CurrentUser,
  LoggedInUserInterface,
  setPermissions,
} from '@app/common';
import { PermissionGuard } from '@app/auth/guards/permission.guard';

@Controller('licenses')
@UseGuards(JwtGuard, PermissionGuard)
export class LicensesController {
  constructor(private readonly licensesService: LicensesService) {}

  @Get('own')
  @setPermissions(['read_own_license'])
  getOwnLicense(@CurrentUser() user: LoggedInUserInterface): Promise<License> {
    return this.licensesService.getLicenseBy({
      id: user.client_details?.license?.id,
    });
  }

  @Patch('own/status/:status')
  @setPermissions(['change_own_license_status'])
  async changeOwnLicenseStatus(
    @Param('status') status: string,
    @CurrentUser() user: LoggedInUserInterface,
  ): Promise<any> {
    return this.licensesService.changeLicenseStatus(
      user.client_details?.license?.id,
      status,
      user,
    );
  }

  @Get('/:id')
  @setPermissions(['read_any_license'])
  getLicenseById(@Param('id') id: number): Promise<License> {
    return this.licensesService.getLicenseBy({ id });
  }

  @Get()
  @setPermissions(['read_all_licenses'])
  getLicenses(@Paginate() query: PaginateQuery): Promise<Paginated<License>> {
    return this.licensesService.getLicenses(query);
  }

  @Patch('/:id/status/:status')
  @setPermissions(['change_any_license_status'])
  async changeLicenseStatus(
    @Param('id') id: number,
    @Param('status') status: string,
    @CurrentUser() user: LoggedInUserInterface,
  ): Promise<any> {
    return this.licensesService.changeLicenseStatus(id, status, user);
  }

  @Patch('/:id/stores/:stores')
  @setPermissions(['change_any_license_stores_number'])
  async editLicense(
    @Param('id') id: number,
    @Param('stores') storesNumber: number,
  ): Promise<License> {
    console.log(storesNumber, 'storesNumber');
    return await this.licensesService.changeLicenseStores(id, +storesNumber);
  }

  @Patch(':id/pay/:months')
  @setPermissions(['extend_license'])
  async extendLicense(
    @CurrentUser() user: LoggedInUserInterface,
    @Param('id') id: number,
    @Param('months') months: number,
  ) {
    return await this.licensesService.extendLicense(id, months, user);
  }

  @Get(':id/pay/:months')
  @setPermissions(['read_extend_license'])
  async extendLicenseInfo(
    @CurrentUser() user: LoggedInUserInterface,
    @Param('id') id: number,
    @Param('months') months: number,
  ) {
    return await this.licensesService.extendLicenseInfo(id, months);
  }
}
