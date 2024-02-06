import { Expose, Type } from 'class-transformer';
import { PermissionsDto } from '@app/common/dtos';
import { ValidateNested } from 'class-validator';

export class RoleResponseDto {
  @Expose()
  id: number;
  @Expose()
  name: string;
  @Expose()
  @Type(() => PermissionsDto)
  @ValidateNested({ each: true })
  has: PermissionsDto[];
}
