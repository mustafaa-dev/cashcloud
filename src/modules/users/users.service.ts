import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  getUsers(): string {
    return 'This action returns all users';
  }

  getUser(id: number): string {
    return `This action returns a #${id} user`;
  }

  createUser(): string {
    return 'This action adds a new user';
  }

  updateUser(id: number): string {
    return `This action updates a #${id} user`;
  }

  deleteUser(id: number): string {
    return `This action removes a #${id} user`;
  }
}
