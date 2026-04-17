import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role'); // Assuming you store the role

  if (token) {
    const target = role === 'CLIENT' ? '/client/dashboard' : '/secretaire/dashboard';
    router.navigate([target]); 
    return false;
  }
  return true; 
};