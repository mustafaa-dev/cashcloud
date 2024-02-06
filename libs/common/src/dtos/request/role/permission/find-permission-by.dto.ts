import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FindPermissionByDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  id?: number;
}
