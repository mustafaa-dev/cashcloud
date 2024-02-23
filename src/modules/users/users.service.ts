import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserRepository } from './repositories';
import {
  AddAdminDto,
  AddClientDto,
  ApiResponse,
  GET_USERS_PAGINATE_CONFIG,
  LoggedInUserInterface,
  sendSuccess,
} from '@app/common';
import { AdminDetails, ClientDetails, User } from './entities';
import { MediaService } from '../media/media.service';
import { generateNumber } from '@app/common/utils';
import { Picture } from '@app/media/entities';
import { compareSync } from 'bcryptjs';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { EntityManager } from 'typeorm';
import { LicensesService } from '@app/license/licenses.service';
import { License } from '@app/license/entities/license.entity';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { RolesService } from '@app/roles/roles.service';
import { Role } from '@app/roles/entities';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly mediaService: MediaService,
    private readonly rolesService: RolesService,
    private readonly entityManager: EntityManager,
    private readonly licenseService: LicensesService,
  ) {}

  async addAdmin(
    addAdminDto: AddAdminDto,
    picture: Express.Multer.File,
  ): Promise<User> {
    let userPicture: Picture;
    return this.entityManager.transaction(async (transaction) => {
      if (picture) {
        userPicture = await this.mediaService.uploadPicture(picture);
        await transaction.save(userPicture);
      }
      const role: Role = await this.rolesService.getRoleBy({ name: 'admin' });
      const newUser: User = new User();
      const newAdminDetails: AdminDetails = new AdminDetails();
      Object.assign(newUser, {
        ...addAdminDto,
        picture: userPicture,
        role,
        admin_details: newAdminDetails,
      });
      await transaction.save(newAdminDetails);
      return await transaction.save(newUser);
    });
  }

  async addClient(
    addClientDto: AddClientDto,
    picture: Express.Multer.File,
  ): Promise<User> {
    let userPicture: Picture;
    const role: Role = await this.rolesService.getRoleBy({ name: 'client' });
    const license: License = await this.licenseService.createLicense(
      await generateNumber(8),
      addClientDto.no_of_stores,
    );
    const newClientDetails: ClientDetails = new ClientDetails();
    const newUser: User = new User();
    delete addClientDto.no_of_stores;
    return this.entityManager.transaction(
      async (transaction: EntityManager): Promise<User> => {
        if (picture) {
          userPicture = await this.mediaService.uploadPicture(picture);
          await transaction.save(userPicture);
        }
        newClientDetails.license = license;
        Object.assign(newUser, {
          ...addClientDto,
          picture: userPicture,
          role,
        });
        newUser.client_details = newClientDetails;
        await transaction.save(license);
        await transaction.save(newClientDetails);
        console.log(newUser, 'newUser');
        return await transaction.save(newUser);
      },
    );
  }

  async getUsers(
    query: PaginateQuery,
    user: LoggedInUserInterface,
  ): Promise<Paginated<User>> {
    const role: string = user.role.name;
    const config = GET_USERS_PAGINATE_CONFIG(role);

    return paginate(
      query,
      this.usersRepository.createQueryBuilder('users'),
      config,
    );
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

  async deleteUser(id: number, role: string): Promise<ApiResponse<string>> {
    const user: User = await this.usersRepository.findOne({ where: { id } });
    if (user.role.name !== role)
      throw new UnprocessableEntityException(
        `You can't delete ${user.role.name} user using delete ${role} route`,
      );
    return sendSuccess('User Deleted Successfully');
  }

  async validateUser(where: any): Promise<User> {
    const { username, password, license } = where;
    const user = await this.checkUserPassword(username, password);
    if (
      license &&
      user.client_details &&
      user.client_details.license.code !== license
    ) {
      throw new BadRequestException('Invalid License');
    }

    if (!user.active)
      throw new BadRequestException(
        'User Disabled, Please contact for activation',
      );
    return user;
  }

  async checkUserPassword(username: string, password: string): Promise<User> {
    const user: User = await this.usersRepository.findOne({
      where: { username },
    });
    const isCorrectPassword: boolean = compareSync(password, user.password);
    if (!isCorrectPassword) throw new ForbiddenException('Bad Credentials');
    return user;
  }

  // async getUserLocation() {
  //   const response = await axios.get('https://ipapi.co/json/');
  //   const { latitude, longitude } = response.data;
  //   return { latitude, longitude };
  // }
}
