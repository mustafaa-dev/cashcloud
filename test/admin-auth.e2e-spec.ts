import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { Response } from 'supertest';
import { sendSuccess } from '@app/common';

let token = '';
const adminLogin = {
  username: 'example_user',
  password: 'example_user_password',
};
const userRegisterData = {
  ...adminLogin,
  email: 'example_user@test.com',
  name: 'Example User',
  phone: '+201112645862',
  confirmPassword: 'example_user_password',
};

const iERROR = {
  statusCode: expect.any(Number),
  timestamp: expect.any(String),
  path: expect.any(String),
  message: expect.any(String),
};

describe('Admin Auth (e2e)', () => {
  let app: INestApplication;

  const url: string = 'http://localhost:9000/api/v4/admin/auth/';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('Admin Auth - Register', () => {
    it('SUCCESS ADMIN REGISTER (POST)', async () => {
      return request(url)
        .post('register')
        .send(userRegisterData)
        .then((r: Response) => {
          token = `Bearer ${r.body.data}`;
          expect(r.body).toEqual({ ...sendSuccess(expect.any(String)) });
        });
    });
    it('FAILED ADMIN REGISTER (POST) - IF DUPLICATED DATA', () => {
      return request(url)
        .post('register')
        .send(userRegisterData)
        .expect(406)
        .then((r) => {
          expect(r.body).toEqual(iERROR);
        });
    });
  });

  describe('Admin Auth - Login', () => {
    it('FAILED ADMIN LOGIN (POST) - USER DISABLED ', async () => {
      return request(url)
        .post('login')
        .send(adminLogin)
        .expect(400)
        .then((r: Response) => {
          expect(r.body).toEqual({
            statusCode: 400,
            timestamp: expect.any(String),
            path: '/api/v4/admin/auth/login',
            message: 'User Disabled, Please contact for activation',
          });
        });
    });
    it('FAILED ADMIN LOGIN (POST) - IF WRONG DATA', () => {
      return request(url)
        .post('login')
        .send({ username: 'x', password: 'r' })
        .expect(404);
    });

    it('SUCCESS ADMIN LOGIN (POST)', () => {
      return request(url)
        .post('login')
        .send(adminLogin)
        .expect(201)
        .then((r: Response) => {
          token = `Bearer ${r.body.data}`;
          expect(r.body).toEqual({ ...sendSuccess(expect.any(String)) });
        });
    });
  });

  describe('Admin Auth - Logout', () => {
    it('SUCCESS ADMIN LOGOUT (GET)  - with token sent', async () => {
      return request(url)
        .get('logout')
        .set('Authorization', token)
        .expect(200, {
          status: 'success',
          statusCode: 200,
          message: 'Success',
          data: 'User Logged out successfully',
        });
    });
    it('FAILED ADMIN LOGOUT (GET) - If not Logged in', async () => {
      return request(url).get('logout').expect(401);
    });
  });
});
