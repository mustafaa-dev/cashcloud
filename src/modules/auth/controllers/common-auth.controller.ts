import {
  Body,
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
  LoggedInUserInterface,
  Public,
  RegisterDto,
  ResetPasswordDto,
  SendResetPasswordDto,
  UserRegistrationPipe,
  VerificationDto,
} from '@app/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@app/users/entities';
import { ApiBearerAuth } from '@nestjs/swagger';
import { TwoFAGuard } from '@app/auth/guards/2fa.guard';

export class CommonAuthController {
  constructor(protected readonly authService: AuthService) {}

  @Get('logout')
  @ApiBearerAuth()
  async logout(@CurrentUser() { session_id }: any): Promise<any> {
    return await this.authService.logout(session_id);
  }

  @Post('register')
  @Public()
  @UseInterceptors(FileInterceptor('picture'))
  // @Serialize(AdminRegistrationResponseDto)
  async register(
    @UploadedFile() picture: Express.Multer.File,
    @Body(UserRegistrationPipe) registerDto: RegisterDto,
  ): Promise<ApiResponse<string>> {
    return await this.authService.register(registerDto, picture);
  }

  @Patch('verify')
  async verify(
    @CurrentUser() user: User,
    @Body() verificationDto: VerificationDto,
  ): Promise<User> {
    return await this.authService.verify(verificationDto, user);
  }

  @Get('send-verification-code')
  @Public()
  async sendVerification(
    @CurrentUser() user: LoggedInUserInterface,
  ): Promise<any> {
    return await this.authService.sendVerification(user);
  }

  @Post('send-reset-password')
  @Public()
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

  @Get('2fa-qrcode')
  async get2faQrCode(@CurrentUser() user: LoggedInUserInterface) {
    return await this.authService.get2faQrCode(user);
  }

  @Patch('2fa-enable')
  async enable2fa(
    @CurrentUser() user: LoggedInUserInterface,
    @Body() body: any,
  ) {
    return await this.authService.enable2fa(user, body);
  }

  @Patch('2fa-disable')
  @UseGuards(TwoFAGuard)
  async disable2Fa(
    @CurrentUser() user: LoggedInUserInterface,
    @Body() body: any,
  ) {
    return await this.authService.disable2Fa(user, body);
  }
}
