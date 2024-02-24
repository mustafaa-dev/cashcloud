import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  AddAdminDto,
  AddClientDto,
  ApiResponse,
  CurrentUser,
  GET_USERS_PAGINATE_CONFIG,
  LoggedInUserInterface,
  setPermissions,
} from '@app/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from './entities';
import {
  ApiPaginationQuery,
  Paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';
import { JwtGuard, PermissionGuard } from '@app/auth/guards';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Add Admin - For Super Admin Only' })
  @ApiBody({ type: AddAdminDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  @ApiBadRequestResponse({ description: 'Bad Data' })
  @Post('/admin')
  @UseInterceptors(FileInterceptor('picture'))
  @UseGuards(PermissionGuard)
  @setPermissions(['add_admin_user'])
  async addAdmin(
    @UploadedFile() picture: Express.Multer.File,
    @Body() addAdminDto: AddAdminDto,
  ): Promise<User> {
    return await this.usersService.addAdmin(addAdminDto, picture);
  }

  @ApiOperation({ summary: 'Add Admin - For Admins' })
  @ApiBody({ type: AddClientDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  @ApiBadRequestResponse({ description: 'Bad Data' })
  @Post('/client')
  @UseInterceptors(FileInterceptor('picture'))
  @UseGuards(PermissionGuard)
  @setPermissions(['add_client_user'])
  async addClient(
    @UploadedFile() picture: Express.Multer.File,
    @Body() addClientDto: AddClientDto,
  ): Promise<User> {
    return await this.usersService.addClient(addClientDto, picture);
  }

  // @Get('my-location')
  // async getLocation(): Promise<{ latitude: number; longitude: number }> {
  //   return await this.usersService.getUserLocation();
  // }

  @ApiOperation({ summary: 'Get All Users - For Admins' })
  @ApiPaginationQuery(GET_USERS_PAGINATE_CONFIG('admin'))
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  @ApiBadRequestResponse({ description: 'Bad Data' })
  @Get()
  // @Version('1')
  @setPermissions(['read_all_users'])
  async getUsers(
    @Paginate() query: PaginateQuery,
    @CurrentUser() user: any,
  ): Promise<Paginated<User>> {
    return await this.usersService.getUsers(query, user);
  }

  @ApiOperation({ summary: 'Get Profile' })
  @ApiPaginationQuery(GET_USERS_PAGINATE_CONFIG('admin'))
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  @ApiBadRequestResponse({ description: 'Bad Data' })
  @Get('/me')
  @setPermissions(['read_own_user'])
  async getMe(@CurrentUser() user: LoggedInUserInterface): Promise<User> {
    return await this.usersService.getUserBy({ id: user.id });
  }

  @Get('/:id')
  @setPermissions(['read_any_user'])
  async getUserById(id: number): Promise<User> {
    return await this.usersService.getUserBy({ id });
  }

  @Delete('/admin/:id')
  // @UseGuards(PermissionGuard)
  @setPermissions(['delete_admin_user'])
  async deleteAdmin(@Param('id') id: any): Promise<ApiResponse<string>> {
    return await this.usersService.deleteUser(+id, 'admin');
  }

  @Delete('/client/:id')
  // @UseGuards(PermissionGuard)
  @setPermissions(['delete_client_user'])
  async deleteClient(@Param('id') id: number): Promise<ApiResponse<string>> {
    return await this.usersService.deleteUser(+id, 'client');
  }

  @Delete('/employee/:id')
  // @UseGuards(PermissionGuard)
  @setPermissions(['delete_employee_user'])
  async deleteEmployee(@Param('id') id: number): Promise<ApiResponse<string>> {
    return await this.usersService.deleteUser(+id, 'employee');
  }
}
