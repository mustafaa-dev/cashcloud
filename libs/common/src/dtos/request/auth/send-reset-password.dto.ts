import { IsOptional, IsString } from 'class-validator';

export class SendResetPasswordDto {
  @IsString()
  @IsOptional()
  username: string;
}
