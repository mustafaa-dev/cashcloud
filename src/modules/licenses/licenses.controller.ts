import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { LicensesService } from './licenses.service';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { License } from './entities';

@Controller('licenses')
@UseGuards(JwtGuard)
export class LicensesController {
  constructor(private readonly licensesService: LicensesService) {}

  @Get('/:id')
  getLicenseById(@Param('id') id: number) {
    return this.licensesService.getLicenseBy(id);
  }

  @Get()
  getLicenses(@Paginate() query: PaginateQuery): Promise<Paginated<License>> {
    return this.licensesService.getLicenses(query);
  }

  // @Patch('/:id/:status')
  // @Permissions(['change-license-status'])
  // @UseGuards(PermissionGuard)
  // async changeLicenseStatus(
  //   @Param('id') id: number,
  //   @Param('status') status: string,
  //   @CurrentUser() user: User,
  // ): Promise<any> {
  //   return this.licensesService.changeLicenseStatus(id, status, user);
  // }
}
