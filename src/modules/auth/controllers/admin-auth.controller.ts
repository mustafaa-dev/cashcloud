import {
  Body,
  Controller,
  Get,
  Ip,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import {
  ApiResponse,
  CurrentUser,
  LoggedInUserInterface,
  RegisterDto,
  ResetPasswordDto,
  SendResetPasswordDto,
  UserRegistrationPipe,
  VerificationDto,
} from '@app/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '../../users/entities/user.entity';
import { LocalAuthGuard } from '../guards/local.guard';
import { JwtGuard } from '../guards/jwt.guard';

@Controller('admin/auth')
// @UseInterceptors(CacheInterceptor) // Add This here
export class AdminAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @Req() req: Request,
    @Ip() ip: string,
    @CurrentUser() user: User,
  ): Promise<ApiResponse<any>> {
    return await this.authService.login(user, req, ip);
  }

  @Get('logout')
  @UseGuards(JwtGuard)
  async logout(@CurrentUser() { session_id }: any): Promise<any> {
    return await this.authService.logout(session_id);
  }

  @Post('register')
  @UseInterceptors(FileInterceptor('picture'))
  // @Serialize(AdminRegistrationResponseDto)
  async register(
    @UploadedFile() picture: Express.Multer.File,
    @Body(UserRegistrationPipe) registerDto: RegisterDto,
  ): Promise<ApiResponse<string>> {
    return await this.authService.register(registerDto, picture);
  }

  @Patch('verify')
  @UseGuards(JwtGuard)
  async verify(
    @CurrentUser() user: User,
    @Body() verificationDto: VerificationDto,
  ): Promise<User> {
    return await this.authService.verify(verificationDto, user);
  }

  @Get('send-verification-code')
  @UseGuards(JwtGuard)
  async sendVerification(
    @CurrentUser() user: LoggedInUserInterface,
  ): Promise<any> {
    return await this.authService.sendVerification(user);
  }

  @Post('send-reset-password')
  async sendResetPassword(@Body() sendResetPasswordDto: SendResetPasswordDto) {
    return await this.authService.sendResetPassword(sendResetPasswordDto);
  }

  @Patch('reset-password/:token')
  // @Serialize(UserDto)
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Param('token') token: string,
  ): Promise<any> {
    return await this.authService.resetPassword(resetPasswordDto, token);
  }
}
