import { Controller, Ip, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth.service';
import {
  ApiAcceptedResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { AdminLoginDto, ApiResponse, CurrentUser, Public } from '@app/common';
import { User } from '@app/users/entities';
import { JwtGuard, LocalAuthGuard } from '@app/auth/guards';
import { CommonAuthController } from '@app/auth/controllers/common-auth.controller';

@Controller('auth')
@UseGuards(JwtGuard)
export class UsersAuthController extends CommonAuthController {
  constructor(authService: AuthService) {
    super(authService);
  }

  @ApiBody({ type: AdminLoginDto })
  @ApiAcceptedResponse({ status: 201 })
  @ApiOperation({ summary: 'Admin Login' })
  @ApiNotFoundResponse()
  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  async login(
    @Req() req: Request,
    @Ip() ip: string,
    @CurrentUser() user: User,
  ): Promise<ApiResponse<any>> {
    return await this.authService.login(user, req, ip);
  }
}
