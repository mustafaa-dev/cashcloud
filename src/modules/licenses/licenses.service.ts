import { Injectable } from '@nestjs/common';
import { LicenseRepository } from './repositories';
import { License } from './entities';
import { addMonths } from 'date-fns';
import {
  paginate,
  Paginated,
  PaginateQuery,
  PaginationType,
} from 'nestjs-paginate';
import { User } from '../users';

@Injectable()
export class LicensesService {
  constructor(private readonly licenseRepository: LicenseRepository) {}

  async createLicense(code: number, noOfStores: number): Promise<License> {
    const licenseExpireDate: Date = addMonths(new Date(), 1);
    const newLicense: License = new License();
    newLicense.code = code;
    newLicense.active = true;
    newLicense.expiresAt = licenseExpireDate;
    newLicense.no_of_stores = noOfStores;
    return newLicense;
  }

  async getLicenseBy(options: any): Promise<License> {
    return this.licenseRepository.findOne(options);
  }

  async getLicenses(query: PaginateQuery): Promise<Paginated<License>> {
    return paginate(
      query,
      await this.licenseRepository.createQueryBuilder('licenses'),
      {
        sortableColumns: ['id', 'code', 'active', 'expiresAt', 'no_of_stores'],
        paginationType: PaginationType.LIMIT_AND_OFFSET,
        defaultSortBy: [['expiresAt', 'DESC']],
        searchableColumns: [
          'createdAt',
          'updatedAt',
          'active',
          'code',
          'expiresAt',
          'no_of_stores',
        ],
        select: ['id', 'code', 'active', 'expiresAt', 'no_of_stores'],
      },
    );
  }

  async changeLicenseStatus(
    id: number,
    status: string,
    loggedInUser: User,
  ): Promise<any> {
    // const license = await this.getLicenseBy(id);
    // if (license.active && status === 'true')
    //   throw new BadRequestException('Already Activated');
    // if (!license.active && status === 'false')
    //   throw new BadRequestException('Already deactivated');
    // license.active = status === 'true';
    // return await this.licenseRepository.saveOne(license);
  }
}
