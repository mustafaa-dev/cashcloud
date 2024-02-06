import { Expose } from 'class-transformer';

export class VerificationResponseDto {
  @Expose()
  code: number;
  @Expose()
  codeExpiration: Date;
}
