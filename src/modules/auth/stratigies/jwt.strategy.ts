import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { SessionPayloadInterface, TokenPayloadInterface } from '@app/common';
import { User } from '../../users/entities/user.entity';
import { Request } from 'express';
import { RedisService } from '@app/common/modules/redis/redis.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly userService: UsersService,
    // @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(RedisService) private readonly redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, { id, session_id }: TokenPayloadInterface) {
    const user: User = await this.userService.getUserBy({ id });
    const session: SessionPayloadInterface =
      await this.redisService.getLogInSession(session_id);
    const browser: string = req.headers['user-agent'];
    const ip: string = req.socket.remoteAddress;
    if (!session) throw new UnauthorizedException("User isn't logged in");
    if (browser !== session.browser || ip !== session.ip) {
      await this.redisService.deleteLogInSession(session_id);
      throw new UnauthorizedException('Please Login Again');
    }
    return { user, session_id };
  }
}
