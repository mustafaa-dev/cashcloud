import { IsOptional, IsString } from 'class-validator';

export class PermissionQueryDto {
  @IsString()
  @IsOptional()
  name: string;
}
