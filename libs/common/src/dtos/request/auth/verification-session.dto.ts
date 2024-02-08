import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class VerificationSessionDto {
  @IsNotEmpty()
  verificationCode: number;

  @IsNumber()
  @IsNotEmpty()
  id: number;
  @IsDate()
  @IsNotEmpty()
  expiration: Date;
}
