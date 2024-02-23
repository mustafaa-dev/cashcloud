import { Controller, Ip, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth.service';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiResponse, CurrentUser, Public, SuccessResponse } from '@app/common';
import { User } from '@app/users/entities';
import { JwtGuard, LocalAuthGuard } from '@app/auth/guards';
import { CommonAuthController } from '@app/auth/controllers/common-auth.controller';
import { UserLoginDto } from '@app/common/dtos/request/auth/user-login.dto';

@ApiTags('User Auth')
@ApiUnauthorizedResponse({
  description: "Can't be accessed || Unauthorized",
})
@ApiForbiddenResponse({ description: 'Forbidden resource' })
@ApiCreatedResponse({ description: 'Created', type: SuccessResponse })
@Controller('auth')
@UseGuards(JwtGuard)
export class UsersAuthController extends CommonAuthController {
  constructor(authService: AuthService) {
    super(authService);
  }

  @ApiBody({ type: UserLoginDto })
  @ApiAcceptedResponse({ status: 201 })
  @ApiOperation({ summary: 'User Login' })
  @ApiNotFoundResponse({ description: 'User Not found' })
  @ApiBadRequestResponse({ description: 'Bad Request , something is required' })
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
