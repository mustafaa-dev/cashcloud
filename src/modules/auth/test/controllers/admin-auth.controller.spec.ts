import { Test, TestingModule } from '@nestjs/testing';
import { AdminAuthController } from '../../controllers/admin-auth.controller';
import { AuthService } from '../../auth.service';

global.g = 'dewfe';
describe('AdminAuthController', () => {
  let controller: AdminAuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminAuthController],
      providers: [
        {
          provide: AuthService,
          useValue: { login: jest.fn() },
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
    test('Should return user data', () => {
      // jest.spyOn(service.login());
    });
  });
});
