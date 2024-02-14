import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class TwoFAGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const user2Fa = context.switchToHttp().getRequest().user.twoFA;
    if (!user2Fa) {
      throw new ForbiddenException('2FA is not enabled');
    }
    return true;
  }
}
