import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  AddAdminDto,
  AddClientDto,
  ApiResponse,
  CurrentUser,
  LoggedInUserInterface,
  setPermissions,
} from '@app/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from './entities';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

@Controller('users')
// @UseGuards(JwtGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/admin')
  @UseInterceptors(FileInterceptor('picture'))
  // @UseGuards(PermissionGuard)
  @setPermissions(['add_admin_user'])
  async addAdmin(
    @UploadedFile() picture: Express.Multer.File,
    @Body() addAdminDto: AddAdminDto,
  ): Promise<User> {
    return await this.usersService.addAdmin(addAdminDto, picture);
  }

  @Post('/client')
  @UseInterceptors(FileInterceptor('picture'))
  // @UseGuards(PermissionGuard)
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

  @Get()
  async getUsers(
    @Paginate() query: PaginateQuery,
    @CurrentUser() user: LoggedInUserInterface,
  ): Promise<Paginated<User>> {
    return await this.usersService.getUsers(query, user);
  }

  @Get('/me')
  async getMe(@CurrentUser() user: LoggedInUserInterface): Promise<User> {
    return await this.usersService.getUserBy({ id: user.id });
  }

  @Get('/:id')
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
