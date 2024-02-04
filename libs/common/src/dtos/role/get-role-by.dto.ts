import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetRoleByDto {
  @IsOptional()
  @IsNumber()
  id?: number;
  @IsOptional()
  @IsString()
  name?: string;
}
