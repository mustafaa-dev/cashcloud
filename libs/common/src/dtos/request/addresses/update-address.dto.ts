import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateAddressDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  address: string;
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  city: string;
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  government: string;
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  latitude: string;
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  longitude: string;
}
