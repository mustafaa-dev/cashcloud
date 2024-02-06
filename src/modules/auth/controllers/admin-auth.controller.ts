import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import {
  ApiResponse,
  CurrentUser,
  RegisterDto,
  SendResetPasswordDto,
  Serialize,
  UserMapper,
  UserRegistrationPipe,
  VerificationDto,
} from '@app/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminRegistrationResponseDto, UserDto } from '@app/common/dtos';
import { User } from '../../users/entities/user.entity';
import { LocalAuthGuard } from '../guards/local.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { ResetPasswordDto } from '@app/common/dtos/request/auth/reset-password.dto';

@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@CurrentUser() user: User): Promise<ApiResponse<any>> {
    return await this.authService.login(user);
  }

  @Get('logout')
  @UseGuards(JwtGuard)
  async logout(@CurrentUser() user: User): Promise<ApiResponse<any>> {
    return await this.authService.logout(user);
  }

  @Post('register')
  @UseInterceptors(FileInterceptor('picture'))
  @Serialize(AdminRegistrationResponseDto)
  async register(
    @UploadedFile() picture: Express.Multer.File,
    @Body(UserRegistrationPipe) registerDto: RegisterDto,
  ): Promise<string> {
    return await this.authService.register(registerDto, picture);
  }

  @Patch('verify')
  @UseGuards(JwtGuard)
  async verify(
    @CurrentUser() user: User,
    @Body() verificationDto: VerificationDto,
  ) {
    console.log(user.id);
    return await this.authService.verify(verificationDto, user);
  }

  @Get('send-verification-code')
  @UseGuards(JwtGuard)
  async sendVerification(@CurrentUser() user: User) {
    return await this.authService.sendVerification(user);
  }

  @Post('send-reset-password')
  async sendResetPassword(@Body() sendResetPasswordDto: SendResetPasswordDto) {
    return await this.authService.sendResetPassword(sendResetPasswordDto);
  }

  @Patch('reset-password/:token')
  @Serialize(UserDto)
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Param('token') token: string,
  ): Promise<UserMapper> {
    return await this.authService.resetPassword(resetPasswordDto, token);
  }
}
