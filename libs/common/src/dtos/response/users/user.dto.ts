import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  name: string;
  @Expose()
  username: string;
  @Expose()
  phone: string;
  @Expose()
  active: string;
  @Expose()
  isVerified: string;
  @Expose()
  picture: string;
  @Expose()
  // @ValidateNested({ each: true })
  // @Type(() => RoleResponseDto)
  role: [];
}
