import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Permission } from '../../roles/permission/entities/permission.entity';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const user = context.switchToHttp().getRequest().user;
    if (user.admin_details?.is_super_admin) return true;
    const userRole = user.role;
    const userPermissions = userRole.has.map((permission: Permission) => {
      return permission.name;
    });
    const requiredPermissions =
      this.reflector.get('permissions', context.getHandler()) || [];
    const hasPermissions = requiredPermissions.every((permission: string) =>
      userPermissions.includes(permission),
    );
    if (requiredPermissions.length === 0 || hasPermissions) return true;
    throw new ForbiddenException('No Sufficient Permissions for this user');
  }
}
