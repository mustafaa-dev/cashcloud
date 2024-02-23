import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerificationDto {
  @ApiProperty({ example: 123456 })
  @IsNotEmpty()
  @IsNumber()
  code: number;
}
