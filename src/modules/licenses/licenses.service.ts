import { BadRequestException, Injectable } from '@nestjs/common';
import { LicenseRepository } from './repositories';
import { License } from './entities';
import { addMonths } from 'date-fns';
import {
  paginate,
  Paginated,
  PaginateQuery,
  PaginationType,
} from 'nestjs-paginate';
import { User } from '@app/users';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { LoggedInUserInterface } from '@app/common';
import { EntityManager } from 'typeorm';
import { Payment } from '../payments';

@Injectable()
export class LicensesService {
  constructor(
    private readonly licenseRepository: LicenseRepository,
    private readonly entityManager: EntityManager,
  ) {}

  async createLicense(code: number, noOfStores: number): Promise<License> {
    const licenseExpireDate: Date = addMonths(new Date(), 1);
    const newLicense: License = new License();
    newLicense.code = code;
    newLicense.active = true;
    newLicense.expiresAt = licenseExpireDate;
    newLicense.no_of_stores = noOfStores;
    return newLicense;
  }

  async getLicenseBy(
    options: QueryDeepPartialEntity<License>,
  ): Promise<License> {
    return this.licenseRepository.findOne({ where: options });
  }

  async getLicenses(query: PaginateQuery): Promise<Paginated<License>> {
    return paginate(
      query,
      this.licenseRepository.createQueryBuilder('licenses'),
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
    const license: License = await this.getLicenseBy({ id });
    if (license.active && status === 'true')
      throw new BadRequestException('Already Activated');
    if (!license.active && status === 'false')
      throw new BadRequestException('Already deactivated');
    license.active = status === 'true';
    return await this.licenseRepository.saveOne(license);
  }

  async changeLicenseStores(
    id: number,
    storesNumber: number,
  ): Promise<License> {
    return await this.licenseRepository.findOneAndUpdate(
      { id },
      { no_of_stores: storesNumber },
    );
  }

  async editLicense(
    id: number,
    noOfStores: number,
    loggedInUser: LoggedInUserInterface,
  ) {
    const license = await this.getLicenseBy({ id });
    // if (license.no_of_stores.length <= noOfStores) license.noOfStores = noOfStores;
    // else
    //   throw new BadRequestException(
    //     `Please remove ${license.stores.length - noOfStores} first`,
    //   );
    // const data = await this.licenseRepository.save(license);
    // await this.logService.addLog(
    //   null,
    //   loggedInUser,
    //   'Edit License',
    //   `User Edited license ${license.code} stores with ${license.noOfStores} `,
    // );
    // return data;
  }

  async extendLicense(
    id: number,
    duration: number,
    loggedInUser: LoggedInUserInterface,
  ): Promise<any> {
    const license: License = await this.getLicenseBy({ id });
    const licenseCost = (await this.extendLicenseInfo(id, duration)).Costs;
    license.expiresAt = addMonths(license.expiresAt, duration);
    return this.entityManager.transaction(async (transaction) => {
      const newPayment: Payment = new Payment();
      Object.assign(newPayment, {
        user: loggedInUser.admin_details,
        for: license,
        total: licenseCost['TotalCost'],
      });
      console.log(newPayment, 'newPayment');
      // await this.paymentRepository.save(newPayment);
      // license.payments.push(newPayment);
      // await this.licenseRepository.save(license);
      // await this.logService.addLog(
      //   null,
      //   loggedInUser,
      //   'Extend License',
      //   `User extended license ${license.code} with ${duration} for ${
      //     duration * licenseCost['TotalCost']
      //   }`,
      // );
    });
  }

  async extendLicenseInfo(id: number, duration: number): Promise<any> {
    const license = await this.getLicenseBy({ id });
    const Types = await this.getLicenseStoreTypes(license);
    const licenseCost = await this.calculateLicenseCost(license, duration);

    // return this.buildLicenseInfoResponse(Types, licenseCost);
  }

  async calculateLicenseCost(license: License, duration: number): Promise<any> {
    // const Costs = license.stores
    //   .map((store) => store.type)
    //   .map((type) => type.cost);
    // const TotalCost = duration * Costs.reduce((acc, num) => acc + num, 0);
    // return { Costs, TotalCost };
  }

  async getLicenseStoreTypes(license: License): Promise<any> {
    // return license.stores.map((store) => store.type).map((type) => type.name);
  }
}
