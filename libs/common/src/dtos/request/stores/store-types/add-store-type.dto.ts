import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddStoreTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  cost: number;
}
