import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AddUserDto } from '@app/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(FileInterceptor('picture'))
  async addUser(
    @UploadedFile() picture: Express.Multer.File,
    @Body() addUserDto: AddUserDto,
  ): Promise<User> {
    return await this.usersService.addUser(addUserDto, picture);
  }
}
