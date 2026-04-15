import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ServiceUser } from '../service/service-user';
import { Role } from '../enums/role.enum';
import { map, filter, take } from 'rxjs';

export const roleGuard: CanActivateFn = (route, state) => {
  const userService = inject(ServiceUser);
  const router = inject(Router);
  const token = localStorage.getItem('token');
  if (!token) {
    router.navigate(['/login']);
    return false;
  }
  return userService.user$.pipe(
 
    filter(user => user !== null), 
    take(1), 
    map(user => {
      const userRole = user?.role;
      const expectedRoles = route.data['roles'] as Role[];
      if (userRole && expectedRoles?.includes(userRole)) {
        return true;
      }
      console.warn(`Accès refusé pour le rôle : ${userRole}`);
      router.navigate(['/home']);
      return false;
    })
  );
};