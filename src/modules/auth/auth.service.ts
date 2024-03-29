import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  ApiResponse,
  generateNumber,
  LoggedInUserInterface,
  RedisService,
  RegisterDto,
  RESET_PASSWORD,
  ResetPasswordDto,
  SendResetPasswordDto,
  sendSuccess,
  TokenPayloadInterface,
  VERIFICATION_CODE,
  VerificationDto,
  VerificationSessionDto,
} from '@app/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { hash } from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { addMilliseconds, addMinutes } from 'date-fns';
import * as fs from 'fs';
import * as path from 'path';
import { UsersService } from '@app/users/users.service';
import { User } from '@app/users/entities';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly ee: EventEmitter2,
    @Inject(RedisService) private readonly redisService: RedisService,
  ) {}

  async register(
    registerDto: RegisterDto,
    picture: Express.Multer.File,
  ): Promise<ApiResponse<string>> {
    const user: User = await this.usersService.addAdmin(
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
      role: 'admin',
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
      role: user.role.name,
    };
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
    const passwordResetToken: string =
      await this.createResetPasswordSession(user);
    this.ee.emit(RESET_PASSWORD, {
      token: `${passwordResetToken}`,
      validTo: passwordResetToken,
      email: user.email,
    });
    return { passwordResetToken };
  }

  async resetPassword(
    { password }: ResetPasswordDto,
    token: string,
  ): Promise<any> {
    const passwordResetSession =
      await this.redisService.getResetPasswordSession(token);
    if (!passwordResetSession) throw new BadRequestException('Invalid token');
    if (passwordResetSession.passwordResetExpiration < new Date())
      throw new BadRequestException('Token Expired');

    await this.usersService.updateUserBy(
      { id: passwordResetSession.id },
      { password: await hash(password, 10) },
    );
    await this.redisService.deletePasswordResetSession(token);
    return sendSuccess('Reset Successfully');
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

  async validateAdmin(where: any) {
    return await this.usersService.validateUser(where);
  }

  async validateUser(where: any) {
    return await this.usersService.validateUser(where);
  }

  async createUserToken(payload: TokenPayloadInterface): Promise<string> {
    return this.jwtService.sign(payload, {
      privateKey: fs.readFileSync(
        path.join(__dirname, '..', '..', '..', '..', 'keys', 'private-key.pem'),
      ),
      algorithm: 'RS256',
    });
  }

  async createResetPasswordSession(user: User): Promise<any> {
    const session_id: string = randomBytes(32).toString('hex');
    // const passwordResetToken: string = createHash('sha256')
    //   .update(user.id.toString())
    //   .digest('hex');

    await this.redisService.saveResetPasswordSession(session_id, {
      id: user.id,
      passwordResetExpiration: addMinutes(new Date(), 10),
    });
    return session_id;
  }

  async get2faQrCode(user: LoggedInUserInterface) {
    const secret = speakeasy.generateSecret({
      name: 'Cashcloud',
      issuer: 'Cashcloud',
      length: 20,
    });
    await this.redisService.saveUser2FASecret(user.session_id, secret);
    const qr: string = await QRCode.toDataURL(secret.otpauth_url);
    return {
      qr,
      key: secret.base32,
    };
  }

  async enable2fa(user: LoggedInUserInterface, { code }: any) {
    const secret = await this.redisService.getUser2FASecret(user.session_id);
    if (!secret) throw new BadRequestException('Please Generate new QrCode');
    const verified: boolean = await this.validate2fa(
      { twoFA: secret.base32 },
      code,
    );
    if (verified) {
      await this.usersService.updateUserBy(
        { id: user.id },
        { twoFA: secret.base32 },
      );
      await this.redisService.deleteUser2FASecret(user.session_id);
      return sendSuccess('2FA Enabled');
    } else {
      throw new BadRequestException('Invalid Code');
    }
  }

  async disable2Fa(user: LoggedInUserInterface, { code }: any) {
    const verified: boolean = await this.validate2fa(user, code);
    if (verified) {
      await this.usersService.updateUserBy({ id: user.id }, { twoFA: null });
      return sendSuccess('2FA Disabled');
    } else {
      throw new BadRequestException('Invalid Code');
    }
  }

  async validate2fa({ twoFA }: any, code: number) {
    return speakeasy.totp.verify({
      secret: twoFA,
      encoding: 'base32',
      token: code.toString(),
    });
  }
}
