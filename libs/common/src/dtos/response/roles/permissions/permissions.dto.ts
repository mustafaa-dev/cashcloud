import { Expose } from 'class-transformer';

export class PermissionsDto {
  @Expose()
  id: number;
  @Expose()
  name: string;
}
