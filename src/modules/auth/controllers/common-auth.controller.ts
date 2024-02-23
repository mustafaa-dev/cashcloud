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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TwoFAGuard } from '@app/auth/guards/2fa.guard';

export class CommonAuthController {
  constructor(protected readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User Logout' })
  @ApiNotFoundResponse({ description: 'User Not Logged in' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('logout')
  @ApiBearerAuth('access-token')
  async logout(@CurrentUser() { session_id }: any): Promise<any> {
    return await this.authService.logout(session_id);
  }

  @ApiOperation({ summary: 'User Register' })
  @ApiBadRequestResponse({ description: 'Duplicated Field' })
  @ApiBody({ type: RegisterDto })
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

  @ApiOperation({ summary: 'User Verification' })
  @ApiBadRequestResponse({ description: 'Wrong or Expired Code' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBody({ type: VerificationDto })
  @ApiBearerAuth('access-token')
  @Patch('verify')
  async verify(
    @CurrentUser() user: User,
    @Body() verificationDto: VerificationDto,
  ): Promise<User> {
    return await this.authService.verify(verificationDto, user);
  }

  @ApiOperation({ summary: 'User Send Verification Code' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth('access-token')
  @Get('send-verification-code')
  // @Public()
  async sendVerification(
    @CurrentUser() user: LoggedInUserInterface,
  ): Promise<any> {
    return await this.authService.sendVerification(user);
  }

  @ApiOperation({ summary: 'User Send Reset Password Code' })
  @ApiNotFoundResponse({ description: 'User Not Found' })
  @ApiBody({ type: SendResetPasswordDto })
  @Post('send-reset-password')
  @Public()
  async sendResetPassword(@Body() sendResetPasswordDto: SendResetPasswordDto) {
    return await this.authService.sendResetPassword(sendResetPasswordDto);
  }

  @ApiOperation({ summary: 'User Reset Password' })
  @ApiBadRequestResponse({ description: 'Wrong Or Expired Code' })
  @ApiParam({ name: 'token', required: true })
  @Public()
  @Patch('reset-password/:token')
  // @Serialize(UserDto)
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Param('token') token: string,
  ): Promise<any> {
    return await this.authService.resetPassword(resetPasswordDto, token);
  }

  @ApiOperation({ summary: 'User Generated Authenticator QR Code' })
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  @ApiBearerAuth('access-token')
  @Get('2fa-qrcode')
  async get2faQrCode(@CurrentUser() user: LoggedInUserInterface) {
    return await this.authService.get2faQrCode(user);
  }

  @ApiOperation({ summary: 'User Enables 2FA' })
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  @ApiBadRequestResponse({ description: 'Wrong or Expired Code' })
  @ApiBearerAuth('access-token')
  @ApiBody({ type: VerificationDto })
  @Patch('2fa-enable')
  async enable2fa(
    @CurrentUser() user: LoggedInUserInterface,
    @Body() body: any,
  ) {
    return await this.authService.enable2fa(user, body);
  }

  @ApiOperation({ summary: 'User Disables 2FA' })
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  @ApiBadRequestResponse({ description: 'Wrong or Expired Code' })
  @ApiBearerAuth('access-token')
  @ApiBody({ type: VerificationDto })
  @Patch('2fa-disable')
  @UseGuards(TwoFAGuard)
  async disable2Fa(
    @CurrentUser() user: LoggedInUserInterface,
    @Body() body: any,
  ) {
    return await this.authService.disable2Fa(user, body);
  }
}
