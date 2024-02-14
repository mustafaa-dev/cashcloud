import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@app/users/users.service';
import { SessionPayloadInterface, TokenPayloadInterface } from '@app/common';
import { User } from '@app/users/entities';
import { Request } from 'express';
import { RedisService } from '@app/common/modules/redis/redis.service';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly userService: UsersService,
    @Inject(RedisService) private readonly redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: fs.readFileSync(
        path.join(
          __dirname,
          '..',
          '..',
          '..',
          '..',
          '..',
          'keys',
          'public-key.pem',
        ),
      ),
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    { id, session_id }: TokenPayloadInterface,
  ): Promise<any> {
    const { session, browser, user, ip } = await this.getSessionData(
      id,
      session_id,
      req,
    );
    if (!session) throw new UnauthorizedException("User isn't logged in");
    if (
      browser !== session.browser ||
      ip !== session.ip ||
      req.headers.authorization.split(' ')[1] !== session.token
    ) {
      throw new UnauthorizedException(
        'Different Ip or Browser - Please Login Again',
      );
    }
    return { ...user, session_id };
  }

  async getSessionData(
    id: number,
    session_id: string,
    req: Request,
  ): Promise<any> {
    const user: User = await this.userService.getUserBy({ id });
    const session: SessionPayloadInterface =
      await this.redisService.getLogInSession(session_id);
    const browser: string = req.headers['user-agent'];
    const ip: string = req.socket.remoteAddress;
    return { user, session, browser, ip };
  }
}
