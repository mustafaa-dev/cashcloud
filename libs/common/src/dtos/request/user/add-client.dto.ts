import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { CommonUserDto } from '@app/common/dtos/request/user/common-user.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AddClientDto extends CommonUserDto {
  @ApiProperty({ type: Number, description: 'Number of Stores', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  no_of_stores: number;
}
