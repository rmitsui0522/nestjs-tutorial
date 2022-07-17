import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Auth0Claims } from '../auth/jwt.claims';
import { PERMISSONS_KEY } from './permissions.decorator';
import { Permission } from './permisson.enum';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) return true;

    const { user } = context.switchToHttp().getRequest();

    if (!user) return false;
    console.log(user);
    const hasPermission = requiredPermissions.some((role) =>
      (user as Auth0Claims).permissions.includes(role),
    );

    return hasPermission;
  }
}
