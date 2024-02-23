import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum ROLES {
  ADMIN = 'admin',
  CLIENT = 'client',
  CASHIER = 'cashier',
  MODERATOR = 'moderator',
  SUPERVISOR = 'supervisor',
}

export class CommonUserDto {
  @ApiProperty({ type: String, description: 'Name', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;
  @ApiProperty({ type: String, description: 'Username', example: 'johndoe' })
  @IsString()
  @IsNotEmpty()
  username: string;
  @ApiProperty({ type: String, description: 'Email', example: 'john@doe.com ' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @ApiProperty({ type: String, description: 'Password', example: 'password' })
  @IsString()
  @IsNotEmpty()
  password: string;
  @ApiProperty({ type: String, description: 'Phone', example: '+201234567890' })
  @IsPhoneNumber('EG')
  @IsNotEmpty()
  phone: string;
  @ApiProperty({ type: String, description: 'Role', example: 'client' })
  @IsEnum(ROLES)
  @IsNotEmpty()
  role: string;
  @ApiProperty({
    type: Boolean,
    description: 'Account Status - Optional',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  active: boolean;
}
