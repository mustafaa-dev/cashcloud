import { Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { AddUserDto, VERIFICATION_CODE } from '@app/common';
import { User } from './entities/user.entity';
import { MediaService } from '../media/media.service';
import { Picture } from '../media/entities/picture.entity';
import { RolesService } from '../roles/roles.service';
import { generateNumber } from '@app/common/utils';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly mediaService: MediaService,
    private readonly rolesService: RolesService,
    private readonly ee: EventEmitter2,
  ) {}

  async addUser(
    addUserDto: AddUserDto,
    picture: Express.Multer.File,
  ): Promise<User> {
    const userPicture: Picture = await this.mediaService.uploadPicture(picture);
    const role = await this.rolesService.getRoleBy({ name: addUserDto.role });
    const newUser: User = new User();
    Object.assign(newUser, { ...addUserDto, picture: userPicture, role });
    return await this.usersRepository.create(newUser);
  }

  getUsers(): string {
    return 'This action returns all users';
  }

  getUser(id: number): string {
    return `This action returns a #${id} user`;
  }

  updateUser(id: number): string {
    return `This action updates a #${id} user`;
  }

  deleteUser(id: number): string {
    return `This action removes a #${id} user`;
  }

  async sendVerificationCode(email: string) {
    const code: number = await generateNumber(10);
    this.ee.emit(VERIFICATION_CODE, { email, code });
    return code;
  }
}
