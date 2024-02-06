import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { AddUserDto, AdminLoginDto, VERIFICATION_CODE } from '@app/common';
import { User } from './entities/user.entity';
import { MediaService } from '../media/media.service';
import { RolesService } from '../roles/roles.service';
import { generateNumber } from '@app/common/utils';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Picture } from '../media/entities/picture.entity';
import { Role } from '../roles/entities/role.entity';
import { compare } from 'bcryptjs';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

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
    //upload picture to cloud
    let userPicture: Picture;
    if (picture) userPicture = await this.mediaService.uploadPicture(picture);
    //set role
    const role: Role = await this.rolesService.getRoleBy({
      name: addUserDto.role,
    });
    const newUser: User = new User();

    Object.assign(newUser, {
      ...addUserDto,
      picture: userPicture,
      role,
    });
    return await this.usersRepository.create(newUser);
  }

  getUsers(): string {
    return 'This action returns all users';
  }

  async getUserBy(filter: any): Promise<User> {
    return await this.usersRepository.findOne({ where: filter });
  }

  async updateUserBy(
    by: any,
    update: QueryDeepPartialEntity<User>,
  ): Promise<User> {
    return await this.usersRepository.findOneAndUpdate(by, update);
  }

  deleteUser(id: number): string {
    return `This action removes a #${id} user`;
  }

  async validateUser({ username, password }: AdminLoginDto): Promise<User> {
    const user: User = await this.usersRepository.findOne({
      where: { username },
    });
    const isCorrectPassword: boolean = await compare(password, user.password);
    if (!isCorrectPassword) throw new ForbiddenException('Bad Credentials');
    if (!user.active)
      throw new BadRequestException(
        'User Disabled, Please contact for activation',
      );
    return user;
  }

  async sendVerificationCode(email: string) {
    const code: number = await generateNumber(10);
    this.ee.emit(VERIFICATION_CODE, { email, code });
    return code;
  }
}
