import { BadRequestException, Injectable } from '@nestjs/common';
import { LicenseRepository } from '@app/license/repositories';
import { License } from '@app/license/entities';
import { addMonths } from 'date-fns';
import {
  paginate,
  Paginated,
  PaginateQuery,
  PaginationType,
} from 'nestjs-paginate';
import { User } from '@app/users/entities';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { LoggedInUserInterface } from '@app/common';
import { EntityManager } from 'typeorm';
import { Payment } from '@app/payments/entities';
import { Store } from '@app/stores/entities';
import { StoreType } from '@app/stores/modules/store-types/entites/store-types.entity';

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
    return this.licenseRepository.findOne({
      where: options,
      relations: ['paid'],
    });
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
    const license: License = await this.getLicenseBy({ id });
    if (license.no_of_stores > storesNumber)
      throw new BadRequestException(
        `Please remove ${license.no_of_stores - storesNumber} stores first`,
      );
    return await this.licenseRepository.findOneAndUpdate(
      { id },
      { no_of_stores: storesNumber },
    );
  }

  async extendLicense(
    id: number,
    duration: number,
    loggedInUser: LoggedInUserInterface,
  ): Promise<any> {
    const license: License = await this.getLicenseBy({ id });
    const licenseCost = await this.extendLicenseInfo(id, duration);
    license.expiresAt = addMonths(license.expiresAt, duration);
    return this.entityManager.transaction(
      async (transaction: EntityManager) => {
        const newPayment: Payment = new Payment();
        Object.assign(newPayment, {
          admin: loggedInUser.admin_details,
          license: license,
          total: licenseCost.TotalCost,
        });
        await transaction.save(license);
        return await transaction.save(newPayment);

        // await this.logService.addLog(
        //   null,
        //   loggedInUser,
        //   'Extend License',
        //   `User extended license ${license.code} with ${duration} for ${
        //     duration * licenseCost['TotalCost']
        //   }`,
        // );
      },
    );
  }

  async extendLicenseInfo(id: number, duration: number): Promise<any> {
    const license: License = await this.getLicenseBy({ id });
    const Types = await this.getLicenseStoreTypes(license);
    const licenseCost = await this.calculateLicenseCost(license, duration);
    return { Types, ...licenseCost };
  }

  async calculateLicenseCost(license: License, duration: number): Promise<any> {
    const Costs: number[] = license.stores
      .map((store: Store) => store.store_type)
      .map((type: StoreType) => type.cost);
    const TotalCost: number =
      duration * Costs.reduce((acc: number, num: number) => acc + num, 0);
    return { Costs, TotalCost };
  }

  async getLicenseStoreTypes(license: License): Promise<any> {
    return license.stores
      .map((store: Store) => store.store_type)
      .map((type: StoreType) => type.name);
  }
}
