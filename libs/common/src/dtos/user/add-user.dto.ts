import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

enum ROLES {
  ADMIN = 'admin',
  CLIENT = 'client',
  CASHIER = 'cashier',
  MODERATOR = 'moderator',
  SUPERVISOR = 'supervisor',
}

export class AddUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsPhoneNumber('EG')
  @IsNotEmpty()
  phone: string;

  @IsEnum(ROLES)
  @IsNotEmpty()
  role: string;
}
