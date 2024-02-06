import { BadRequestException, Injectable } from '@nestjs/common';
import {
  ApiResponse,
  RegisterDto,
  RESET_PASSWORD,
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
import { Verification } from './entities/verification.entity';
import { generateNumber } from '@app/common/utils';
import { User } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { EntityManager } from 'typeorm';
import { createHash, randomBytes } from 'crypto';
import { PasswordReset } from './entities/password-reset.entity';
import { ResetPasswordDto } from '@app/common/dtos/request/auth/reset-password.dto';
import { PasswordResetRepository } from './repositories/password-reset.repository';
import { hash } from 'bcryptjs';

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
  ) {}

  async register(
    registerDto: RegisterDto,
    picture: Express.Multer.File,
  ): Promise<string> {
    return this.entityManager.transaction(
      async (transaction: EntityManager) => {
        const verification: Verification = await this.createVerificationSession(
          {
            code: await generateNumber(6),
          },
        );
        const user: User = await this.usersService.addUser(
          { ...registerDto, active: false, role: 'admin' },
          picture,
        );
        verification.user = user;
        await transaction.save(verification);

        this.ee.emit(VERIFICATION_CODE, {
          code: verification.code,
          email: user.email,
        });
        const tokenPayload: TokenPayloadInterface = { id: user.id };
        return await this.createUserToken(tokenPayload);
      },
    );
  }

  async login(user: User): Promise<ApiResponse<string>> {
    const tokenPayload: TokenPayloadInterface = { id: user.id };
    const expires = new Date();
    expires.setMilliseconds(
      expires.getMilliseconds() + +this.configService.get('JWT_EXPIRATION'),
    );
    await this.usersService.updateUserBy({ id: user.id }, { isLoggedIn: true });
    return sendSuccess(await this.createUserToken(tokenPayload));
  }

  async logout(user: User): Promise<ApiResponse<string>> {
    await this.usersService.updateUserBy(
      { id: user.id },
      { isLoggedIn: false },
    );
    return sendSuccess('User Logged out successfully');
  }

  async verify({ code }: VerificationDto, user: User): Promise<User> {
    if (user.isVerified) throw new BadRequestException('User Already Verified');
    const verificationSession = await this.verificationRepository.findOne({
      where: { code },
    });
    if (
      verificationSession.code === code &&
      user.id === verificationSession.user.id &&
      new Date() < verificationSession.codeExpiration
    ) {
      return this.entityManager.transaction(
        async (transactionManager: EntityManager) => {
          user.isVerified = true;
          await transactionManager.save(user);
          await transactionManager.delete(Verification, {
            id: verificationSession.id,
          });
          return user;
        },
      );
    } else {
      throw new BadRequestException('Invalid or Expired code');
    }
  }

  async sendResetPassword({ username }: SendResetPasswordDto) {
    const user: User = await this.usersService.getUserBy({ username });
    return this.entityManager.transaction(
      async (transactionManager: EntityManager) => {
        await transactionManager.delete(PasswordReset, {
          user: { id: user.id },
        });
        const passwordResetSession: PasswordReset =
          await this.createResetPasswordSession(user);
        await transactionManager.save(passwordResetSession);
        this.ee.emit(RESET_PASSWORD, {
          token: passwordResetSession.passwordResetToken,
          validTo: passwordResetSession.passwordResetExpiration,
          email: user.email,
        });
        return passwordResetSession;
      },
    );
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
        user.isLoggedIn = false;
        await transaction.delete(PasswordReset, { passwordResetToken });
        await transaction.save(user);
        const tokenPayload: TokenPayloadInterface = { id: user.id };
        return await this.createUserToken(tokenPayload);
      },
    );
  }

  async sendVerification(user: User): Promise<Verification> {
    if (user.isVerified) throw new BadRequestException('Already Verified');
    return this.entityManager.transaction(
      async (transactionManager: EntityManager): Promise<Verification> => {
        const verification: Verification = await this.createVerificationSession(
          {
            code: await generateNumber(6),
          },
        );
        verification.user = user;
        await transactionManager.save(verification);
        this.ee.emit(VERIFICATION_CODE, {
          code: verification.code,
          email: user.email,
        });
        return verification;
      },
    );
  }

  async createVerificationSession(
    verificationSessionDto: VerificationSessionDto,
  ): Promise<Verification> {
    const newSession: Verification = new Verification();
    Object.assign(newSession, verificationSessionDto);
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
