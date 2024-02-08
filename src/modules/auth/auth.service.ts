import { BadRequestException, Injectable } from '@nestjs/common';
import {
  ApiResponse,
  generateNumber,
  RegisterDto,
  RESET_PASSWORD,
  ResetPasswordDto,
  SendResetPasswordDto,
  sendSuccess,
  TokenPayloadInterface,
  UserMapper,
  VERIFICATION_CODE,
  VerificationDto,
  VerificationSessionDto,
} from '@app/common';
import { UsersService } from '../users/users.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { VerificationRepository } from './repositories/verification.repository';
import { User } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { EntityManager } from 'typeorm';
import { createHash, randomBytes } from 'crypto';
import { PasswordReset } from './entities/password-reset.entity';
import { PasswordResetRepository } from './repositories/password-reset.repository';
import { hash } from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { addMilliseconds, addMinutes } from 'date-fns';
import { RedisService } from '@app/common/modules/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly verificationRepository: VerificationRepository,
    private readonly passwordResetRepository: PasswordResetRepository,
    private readonly entityManager: EntityManager,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly ee: EventEmitter2,
    private readonly redisService: RedisService,
  ) {}

  async register(
    registerDto: RegisterDto,
    picture: Express.Multer.File,
  ): Promise<ApiResponse<string>> {
    const user: User = await this.usersService.addUser(
      { ...registerDto, active: false, role: 'admin' },
      picture,
    );
    const verification: VerificationSessionDto =
      await this.createVerificationSession(user.id);

    this.ee.emit(VERIFICATION_CODE, {
      code: verification.verificationCode,
      email: user.email,
    });
    const session: string = uuid();
    const tokenPayload: TokenPayloadInterface = {
      id: user.id,
      session_id: session,
    };
    const token: string = await this.createUserToken(tokenPayload);
    return sendSuccess(token);
  }

  async login(
    user: User,
    req: Request,
    ip: string,
  ): Promise<ApiResponse<string>> {
    const session: string = uuid();
    const tokenPayload: TokenPayloadInterface = {
      id: user.id,
      session_id: session,
    };
    const expires: Date = new Date();
    expires.setMilliseconds(
      expires.getMilliseconds() + +this.configService.get('JWT_EXPIRATION'),
    );
    const token: string = await this.createUserToken(tokenPayload);

    await this.redisService.saveLogInSession(session, {
      token,
      ip,
      browser: req.headers['user-agent'],
    });
    return sendSuccess(token);
  }

  async logout(session_id: string): Promise<any> {
    await this.redisService.deleteLogInSession(session_id);
    return sendSuccess('User Logged out successfully');
  }

  async verify({ code }: VerificationDto, loggedInUser: any): Promise<User> {
    const user = loggedInUser.user;
    if (user.isVerified) throw new BadRequestException('User Already Verified');
    const verificationSession = await this.redisService.getVerificationSession(
      user.id,
    );

    if (
      verificationSession &&
      +verificationSession.verificationCode === code &&
      user.id === +verificationSession.id &&
      addMilliseconds(new Date(), 1) <
        addMilliseconds(verificationSession.expiration, 1)
    ) {
      user.isVerified = true;
      await this.usersService.updateUserBy({ id: user.id }, user);
      await this.redisService.deleteVerificationSession(user.id);
      return user;
    } else {
      throw new BadRequestException('Invalid or Expired code');
    }
  }

  async sendResetPassword({ username }: SendResetPasswordDto) {
    const user: User = await this.usersService.getUserBy({ username });
    const passwordResetSession: PasswordReset =
      await this.entityManager.transaction(
        async (transactionManager: EntityManager) => {
          await transactionManager.delete(PasswordReset, {
            user: { id: user.id },
          });
          const passwordResetSession: PasswordReset =
            await this.createResetPasswordSession(user);
          await transactionManager.save(passwordResetSession);
          return passwordResetSession;
        },
      );
    this.ee.emit(RESET_PASSWORD, {
      token: `${passwordResetSession.passwordResetToken}`,
      validTo: passwordResetSession.passwordResetExpiration,
      email: user.email,
    });
    return passwordResetSession;
  }

  async resetPassword(
    { password }: ResetPasswordDto,
    token: string,
  ): Promise<UserMapper> {
    const { user, passwordResetExpiration, passwordResetToken }: PasswordReset =
      await this.passwordResetRepository.findOne({
        where: {
          passwordResetToken: token,
        },
      });
    if (passwordResetExpiration < new Date())
      throw new BadRequestException('Token Expired');

    return this.entityManager.transaction(
      async (transaction: EntityManager) => {
        user.password = await hash(password, 10);
        await transaction.delete(PasswordReset, { passwordResetToken });
        await transaction.save(user);
        const tokenPayload: TokenPayloadInterface = {
          id: user.id,
        } as unknown as TokenPayloadInterface;
        return await this.createUserToken(tokenPayload);
      },
    );
  }

  async sendVerification(userInterface: any): Promise<any> {
    const user = userInterface.user;
    if (user.isVerified) throw new BadRequestException('Already Verified');

    const verification: VerificationSessionDto =
      await this.createVerificationSession(user.id);

    await this.redisService.saveVerificationSession(user.id, verification);

    this.ee.emit(VERIFICATION_CODE, {
      code: verification.verificationCode,
      email: user.email,
    });
    return verification;
  }

  async createVerificationSession(id: number): Promise<any> {
    const newSession = {
      verificationCode: await generateNumber(6),
      id,
      expiration: addMinutes(new Date(), 10),
    };
    await this.redisService.saveVerificationSession(id, newSession);
    return newSession;
  }

  async validateUser(username: string, password: string) {
    return await this.usersService.validateUser({ username, password });
  }

  async createUserToken(payload: TokenPayloadInterface) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRATION'),
    });
  }

  async createResetPasswordSession(user: User): Promise<PasswordReset> {
    const token: string = randomBytes(32).toString('hex');
    const passwordResetToken: string = createHash('sha256')
      .update(token)
      .digest('hex');
    const newPasswordResetSession: PasswordReset = new PasswordReset();
    Object.assign(newPasswordResetSession, { passwordResetToken });
    newPasswordResetSession.user = user;
    return newPasswordResetSession;
  }
}
