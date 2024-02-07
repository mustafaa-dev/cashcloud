import { IsNotEmpty, IsString } from 'class-validator';

export class SendResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  username: string;
}
