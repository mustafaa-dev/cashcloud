import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendResetPasswordDto {
  @ApiProperty({ example: 'username' })
  @IsString()
  @IsNotEmpty()
  username: string;
}
