import { BadRequestException, PipeTransform } from '@nestjs/common';

export class UserRegisterationPipe implements PipeTransform {
  transform(value: any): any {
    if (value['password'] !== value['confirmPassword'])
      throw new BadRequestException('Password should match Confirm Password');
    return value;
  }
}
