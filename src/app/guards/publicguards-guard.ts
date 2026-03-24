import { CanActivateFn } from '@angular/router';

export const publicguardsGuard: CanActivateFn = (route, state) => {
  return true;
};
