import { IsNotEmpty, IsString } from 'class-validator';

export class AddRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
