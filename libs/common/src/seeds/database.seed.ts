import { Injectable } from '@nestjs/common';
import { UsersSeed } from '@app/common/seeds/users.seed';
import { RolesSeed } from '@app/common/seeds/roles.seed';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';

@Injectable()
export class SeedsService {
  constructor(
    @Inject(UsersSeed) private readonly usersSeed: UsersSeed,
    @Inject(RolesSeed) private readonly rolesSeed: RolesSeed,
  ) {
    this.seedDatabase().then(
      () => console.log('Database seeded'),
      (error) => console.error('Error seeding database', error),
    );
  }

  async seedDatabase() {
    await this.rolesSeed.seedRoles();
    // await this.usersSeed.seedUsers();
  }
}
