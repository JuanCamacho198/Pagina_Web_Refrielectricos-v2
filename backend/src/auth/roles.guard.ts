import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../generated/prisma/enums';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      if (!requiredRoles) {
        return true;
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const request = context.switchToHttp().getRequest();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const user = request.user;

      if (!user) {
        console.error('RolesGuard: User not found in request. Is JwtAuthGuard running?');
        return false;
      }

      console.log('RolesGuard: Checking roles for user:', user.email, 'Role:', user.role);
      console.log('RolesGuard: Required roles:', requiredRoles);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const hasRole = requiredRoles.some((role) => user.role === role);
      
      if (!hasRole) {
        console.warn(`RolesGuard: User ${user.email} does not have required roles.`);
      }

      return hasRole;
    } catch (error) {
      console.error('RolesGuard: Error executing guard:', error);
      return false;
    }
  }
}
