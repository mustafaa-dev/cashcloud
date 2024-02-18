import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsNumber()
  @Length(14, 14)
  @IsNotEmpty()
  @IsOptional()
  code: number;

  @IsNotEmpty()
  @IsOptional()
  image: any;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  price: number;

  @IsNotEmpty()
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  listed: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  discount: boolean;

  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  discount_value: number;

  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  discount_percentage: number;

  @IsNotEmpty()
  @IsDate()
  @IsOptional()
  discount_validate: Date;
}
