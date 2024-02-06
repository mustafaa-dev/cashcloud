import { Expose, Type } from 'class-transformer';
import { VerificationResponseDto } from '@app/common/dtos';
import { ValidateNested } from 'class-validator';

export class AdminRegistrationResponseDto {
  @Expose()
  name: string;
  @Expose()
  username: string;
  @Expose()
  email: string;
  @Expose()
  phone: string;
  @Expose()
  @Type(() => VerificationResponseDto)
  @ValidateNested({ each: true })
  verification: VerificationResponseDto;
}
