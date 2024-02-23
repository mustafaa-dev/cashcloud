import { Controller, Ip, Post, Req, UseGuards } from '@nestjs/common';
import {
  AdminLoginDto,
  ApiResponse,
  CurrentUser,
  Public,
  SuccessResponse,
} from '@app/common';
import { User } from '@app/users/entities';
import { JwtGuard } from '@app/auth/guards/jwt.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LocalAdminAuthGuard } from '@app/auth/guards/local-admin.guard';
import { CommonAuthController } from '@app/auth/controllers/common-auth.controller';
import { AuthService } from '@app/auth/auth.service';

@Controller('admin/auth')
@ApiTags('Admin Auth')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({
  description: "Can't be accessed || Unauthorized",
})
@ApiForbiddenResponse({ description: 'Forbidden resource' })
@ApiCreatedResponse({ description: 'Created', type: SuccessResponse })
// @UseGuards(PermissionGuard)
@UseGuards(JwtGuard)
export class AdminAuthController extends CommonAuthController {
  constructor(authService: AuthService) {
    super(authService);
  }

  @ApiBody({ type: AdminLoginDto })
  @ApiOperation({ summary: 'Admin Login' })
  @ApiNotFoundResponse({ description: 'User Not found' })
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
