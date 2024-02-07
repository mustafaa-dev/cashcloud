import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { sendSuccess } from '@app/common';
import { UsersService } from '../users/users.service';
import { VerificationRepository } from './repositories/verification.repository';
import { PasswordResetRepository } from './repositories/password-reset.repository';
import { EntityManager } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { addDays, addMinutes } from 'date-fns';

const usersServiceMock = {
  updateUserBy: jest.fn(),
  getUserBy: jest.fn(),
  addUser: jest.fn(),
};

const VerificationRepositoryMock = {
  findOne: jest.fn(),
};
const PasswordResetRepositoryMock = {
  findOne: jest.fn(),
};
const EntityManagerMock = {
  transaction: jest.fn(),
  save: jest.fn(),
};
const JwtServiceMock = {
  sign: jest.fn().mockResolvedValue('Token'),
};
const EventEmitter2Mock = {
  emit: jest.fn(),
};
const ConfigServiceMock = {
  get: jest.fn().mockResolvedValue({
    JWT_EXPIRATION: 1000,
  }),
};

const userRegister = {
  username: 'example',
  password: 'example',
  email: 'example@example.com',
  name: 'example',
  phone: '+201112658502',
};

const userLogin = {
  id: 2,
  username: 'example',
  password: 'example',
  email: 'example@example.com',
} as unknown as User;

const verification = {
  code: 134567,
  user: userLogin,
  codeExpiration: addDays(new Date(), 10),
};
const wrongVerification = {
  code: 115667,
  user: userLogin,
  codeExpiration: addDays(new Date(), -10),
};
const passwordReset = {
  passwordResetToken: 'password_reset_token',
  passwordResetExpiration: addMinutes(new Date(), 10),
  user: userLogin,
};
const wrongPasswordReset = {
  passwordResetToken: 'password_reset_token_wrong',
  passwordResetExpiration: addMinutes(new Date(), -10),
  user: userLogin,
};

describe('AuthService', () => {
  let service: AuthService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
        {
          provide: VerificationRepository,
          useValue: VerificationRepositoryMock,
        },
        {
          provide: PasswordResetRepository,
          useValue: PasswordResetRepositoryMock,
        },
        {
          provide: EntityManager,
          useValue: EntityManagerMock,
        },
        {
          provide: ConfigService,
          useValue: ConfigServiceMock,
        },
        {
          provide: JwtService,
          useValue: JwtServiceMock,
        },
        {
          provide: EventEmitter2,
          useValue: EventEmitter2Mock,
        },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Auth Service - Login', () => {
    it('should return a token', async () => {
      jest.spyOn(usersServiceMock, 'updateUserBy').mockResolvedValueOnce(true);
      expect(await service.login(userLogin)).toEqual(sendSuccess('Token'));
    });
  });

  describe('Auth Service - Logout', () => {
    it('should Logout user', async () => {
      jest.spyOn(usersServiceMock, 'updateUserBy').mockResolvedValueOnce(true);
      expect(await service.logout(userLogin)).toEqual(
        sendSuccess('User Logged out successfully'),
      );
    });
  });
  describe('Auth Service - Verify', () => {
    it('should return false because wrong or expired code', () => {
      jest
        .spyOn(VerificationRepositoryMock, 'findOne')
        .mockResolvedValueOnce(wrongVerification);

      expect(service.verify({ code: 134567 }, userLogin)).rejects.toThrow(
        new BadRequestException('Invalid or Expired code'),
      );
    });

    it('should return false because user already verified', () => {
      expect(
        service.verify({ code: 134567 }, {
          ...userLogin,
          isVerified: true,
        } as unknown as User),
      ).rejects.toThrow(new BadRequestException('User Already Verified'));
    });

    it('should return true because user not verified - correct code - valid', async () => {
      jest
        .spyOn(VerificationRepositoryMock, 'findOne')
        .mockResolvedValueOnce(verification);
      jest
        .spyOn(EntityManagerMock, 'transaction')
        .mockResolvedValueOnce(userLogin);
      const res = await service.verify({ code: 134567 }, userLogin);
      expect(res).toBe(userLogin);
    });
  });
  describe('Auth Service - Send Verification', () => {
    it('should throw bad exception because user is already verified', () => {
      expect(
        service.sendVerification({
          ...userLogin,
          isVerified: true,
        } as unknown as User),
      ).rejects.toThrow(new BadRequestException('Already Verified'));
    });
    it('should create new verification and send the code to user email', () => {
      jest
        .spyOn(EntityManagerMock, 'transaction')
        .mockResolvedValueOnce(verification);
      jest.spyOn(EventEmitter2Mock, 'emit').mockResolvedValueOnce(true);
      expect(service.sendVerification(userLogin)).resolves.toBe(verification);
    });
  });
  describe('Auth Service - sendResetPassword', () => {
    it('should throw a bad request exception because invalid username', () => {
      jest
        .spyOn(usersServiceMock, 'getUserBy')
        .mockRejectedValueOnce(
          new NotFoundException('Password Reset Not Found'),
        );
      expect(
        service.sendResetPassword({ username: 'example' }),
      ).rejects.toThrow(new BadRequestException('Password Reset Not Found'));
    });
    it('Create reset password session and sent it to user mail', () => {
      jest
        .spyOn(usersServiceMock, 'getUserBy')
        .mockResolvedValueOnce(userLogin);
      jest
        .spyOn(EntityManagerMock, 'transaction')
        .mockResolvedValueOnce(passwordReset);
      jest.spyOn(EventEmitter2Mock, 'emit').mockResolvedValueOnce(true);
      expect(service.sendResetPassword({ username: 'example' })).resolves.toBe(
        passwordReset,
      );
    });
  });
  describe('Auth Service - Reset Password', () => {
    it('should throw a bad request exception because invalid token (not found)', () => {
      jest
        .spyOn(PasswordResetRepositoryMock, 'findOne')
        .mockRejectedValueOnce(
          new NotFoundException('Password Reset Session not found'),
        );
      expect(
        service.resetPassword({ password: 'example' }, 'password_reset_token'),
      ).rejects.toThrow(
        new BadRequestException('Password Reset Session not found'),
      );
    });
    it('should throw a bad request exception because invalid token (expired)', () => {
      jest
        .spyOn(PasswordResetRepositoryMock, 'findOne')
        .mockResolvedValueOnce(wrongPasswordReset);
      expect(
        service.resetPassword({ password: 'example' }, 'password_reset_token'),
      ).rejects.toThrow(new BadRequestException('Token Expired'));
    });
    it('should reset password and return a new token', () => {
      jest
        .spyOn(PasswordResetRepositoryMock, 'findOne')
        .mockResolvedValueOnce(passwordReset);
      jest
        .spyOn(EntityManagerMock, 'transaction')
        .mockResolvedValueOnce('new token');
      expect(
        service.resetPassword({ password: 'example' }, 'password_reset_token'),
      ).resolves.toBe('new token');
    });
  });

  describe('Auth Service - Register', () => {
    it('should return user token', async () => {
      jest.spyOn(EntityManagerMock, 'transaction').mockResolvedValueOnce({
        user: userRegister,
        verification: verification,
      });
      jest.spyOn(EventEmitter2Mock, 'emit').mockResolvedValueOnce(true);
      const res = service.register(
        userRegister,
        {} as unknown as Express.Multer.File,
      );
      await expect(res).resolves.toStrictEqual(sendSuccess('Token'));
    });
  });
});
