import { Controller, Ip, Post, Req, UseGuards } from '@nestjs/common';
import { AdminLoginDto, ApiResponse, CurrentUser, Public } from '@app/common';
import { User } from '@app/users/entities';
import { JwtGuard } from '@app/auth/guards/jwt.guard';
import {
  ApiAcceptedResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { LocalAdminAuthGuard } from '@app/auth/guards/local-admin.guard';
import { CommonAuthController } from '@app/auth/controllers/common-auth.controller';
import { AuthService } from '@app/auth/auth.service';

@Controller('admin/auth')
@ApiTags('Admin Auth')
// @UseInterceptors(CacheInterceptor) // Add This here
@UseGuards(JwtGuard)
export class AdminAuthController extends CommonAuthController {
  constructor(authService: AuthService) {
    super(authService);
  }

  @ApiBody({ type: AdminLoginDto })
  @ApiAcceptedResponse({ status: 201 })
  @ApiOperation({ summary: 'Admin Login' })
  @ApiNotFoundResponse()
  @Post('login')
  @Public()
  @UseGuards(LocalAdminAuthGuard)
  async login(
    @Req() req: Request,
    @Ip() ip: string,
    @CurrentUser() user: User,
  ): Promise<ApiResponse<any>> {
    return await this.authService.login(user, req, ip);
  }
}
