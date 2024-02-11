import { Test, TestingModule } from '@nestjs/testing';
import { AdminAuthController } from './admin-auth.controller';
import { AuthService } from '../auth.service';
import { sendSuccess } from '@app/common';
import { User } from '../../users';

describe('AdminAuthController', () => {
  let controller: AdminAuthController;
  let service: AuthService;

  const userLogin = {
    username: 'example',
    password: 'example',
  } as unknown as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminAuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(() => {
              return sendSuccess('access_token');
            }),
            logout: jest.fn(() => {
              return sendSuccess('User Logged out successfully');
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<AdminAuthController>(AdminAuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Login', () => {
    test('Should Login and send access_token (JWT)', async () => {
      expect(await controller.login(userLogin)).toEqual(
        sendSuccess('access_token'),
      );
      expect(service.login).toHaveBeenCalledWith(userLogin);
    });
  });
  describe('Logout', () => {
    test('Should Logout the user ', async () => {
      expect(await controller.logout(userLogin)).toEqual(
        sendSuccess('User Logged out successfully'),
      );
      expect(service.logout).toHaveBeenCalledWith(userLogin);
    });
  });
});
