import { IsNumber } from 'class-validator';
import { AddStoreCommonDto } from '@app/common/dtos/request/stores/add-store-common.dto';

export class AddStoreAdminDto extends AddStoreCommonDto {
  @IsNumber()
  licenseCode: number;
}
