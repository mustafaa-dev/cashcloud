import { IsNotEmpty, IsNumber } from 'class-validator';

export class VerificationDto {
  @IsNotEmpty()
  @IsNumber()
  code: number;
}
