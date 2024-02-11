import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { CommonUserDto } from '@app/common/dtos/request/user/common-user.dto';
import { Type } from 'class-transformer';

export class AddClientDto extends CommonUserDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  no_of_stores: number;
}
