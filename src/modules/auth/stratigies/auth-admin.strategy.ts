import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { User } from '@app/users/entities';
import { Request } from 'express';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
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
    console.log(username, password);

    const user = await this.authService.validateUser(username, password);
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
