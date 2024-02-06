import { IsNotEmpty, IsStrongPassword } from 'class-validator';

export class ResetPasswordDto {
  @IsStrongPassword()
  @IsNotEmpty()
  password;
}
