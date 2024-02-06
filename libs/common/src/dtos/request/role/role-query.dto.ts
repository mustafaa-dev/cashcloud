import { IsOptional, IsString } from 'class-validator';

export class RoleQueryDto {
  @IsString()
  @IsOptional()
  name?: string;
}
