import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UserLoginDto {
  @ApiProperty({ example: 'username' })
  @IsString()
  @IsNotEmpty({
    message: 'Empty Credentials',
  })
  username: string;

  @ApiProperty({ example: 'password' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'license' })
  @IsNumber()
  @IsNotEmpty()
  license: string;
}
