import { CanActivateFn } from '@angular/router';

export const privateguardsGuard: CanActivateFn = (route, state) => {
  return true;
};
