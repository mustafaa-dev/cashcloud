import { Injectable } from '@nestjs/common';
import {
  RegisterDto,
  VERIFICATION_CODE,
  VerificationSessionDto,
} from '@app/common';
import { UsersService } from '../users/users.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { VerificationRepository } from './repositories/verification.repository';
import { Verification } from './entities/verification.entity';
import { generateNumber } from '@app/common/utils';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly verificationRepository: VerificationRepository,
    private readonly ee: EventEmitter2,
  ) {}

  async register(registerDto: RegisterDto, picture: Express.Multer.File) {
    const verification: Verification = await this.createVerificationSession({
      code: await generateNumber(10),
    });

    const user: User = await this.usersService.addUser(
      { ...registerDto, role: 'admin' },
      picture,
    );
    user.verification = verification;
    this.ee.emit(VERIFICATION_CODE, {
      code: verification.code,
      email: user.email,
    });
    return user;
  }

  async createVerificationSession(
    verificationSessionDto: VerificationSessionDto,
  ): Promise<Verification> {
    const newSession = new Verification();
    Object.assign(newSession, verificationSessionDto);
    return await this.verificationRepository.create(newSession);
  }
}
