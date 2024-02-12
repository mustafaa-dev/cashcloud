import { IsNotEmpty, IsString } from 'class-validator';

export class AddCityDto {
  @IsString()
  @IsNotEmpty()
  city: string;
  @IsString()
  @IsNotEmpty()
  government: string;
}
