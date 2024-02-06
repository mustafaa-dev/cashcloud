import { IsNotEmpty, IsString } from 'class-validator';

export class VerificationSessionDto {
  @IsString()
  @IsNotEmpty()
  code: number;
}
