import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AddAddressDto } from '@app/common';

export class AddStoreCommonDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AddAddressDto)
  address: AddAddressDto;
  @IsPhoneNumber('EG')
  @IsNotEmpty()
  phone: string;
  @IsString()
  @IsNotEmpty()
  email: string;
  @IsOptional()
  logo: any;
  @IsNotEmpty()
  storeTypeId: number;
}
