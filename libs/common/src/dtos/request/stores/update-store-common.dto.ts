import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateAddressDto } from '@app/common';

export class UpdateStoreCommonDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => UpdateAddressDto)
  address: UpdateAddressDto;
  @IsPhoneNumber('EG')
  @IsNotEmpty()
  @IsOptional()
  phone: string;
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  email: string;
  @IsOptional()
  logo: any;

  @IsBoolean()
  @IsOptional()
  @IsNotEmpty()
  @Type(() => Boolean)
  active: boolean;
}
