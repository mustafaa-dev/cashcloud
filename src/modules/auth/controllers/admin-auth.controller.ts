import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { RegisterDto, UserRegisterationPipe } from '@app/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login() {}

  @Post('register')
  @UseInterceptors(FileInterceptor('picture'))
  @UsePipes(UserRegisterationPipe)
  async register(
    @UploadedFile() picture: Express.Multer.File,
    @Body() registerDto: RegisterDto,
  ) {
    return await this.authService.register(registerDto, picture);
  }
}
