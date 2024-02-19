import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { User } from '@app/users/entities';
import { Request } from 'express';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'user') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    username: string,
    password: string,
  ): Promise<User> {
    const license = req.body.license;
    if (!license) throw new BadRequestException('License is required');
    const user = await this.authService.validateUser({
      username,
      password,
      license,
    });

    if (user.twoFA !== null) {
      if (!req.body.code) {
        throw new BadRequestException('2FA code is required');
      } else {
        if (!(await this.authService.validate2fa(user, req.body.code)))
          throw new BadRequestException('Invalid 2FA code');
      }
    }
    return user;
  }
}
