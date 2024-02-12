import { IsNotEmpty, IsString } from 'class-validator';

export class AddAddressDto {
  @IsString()
  @IsNotEmpty()
  address: string;
  @IsString()
  @IsNotEmpty()
  city: string;
  @IsString()
  @IsNotEmpty()
  government: string;
  @IsString()
  @IsNotEmpty()
  latitude: string;
  @IsString()
  @IsNotEmpty()
  longitude: string;
}
