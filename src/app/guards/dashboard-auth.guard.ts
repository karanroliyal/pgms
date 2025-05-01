import { CanActivateFn } from '@angular/router';

export const dashboardAuthGuard: CanActivateFn = (route, state) => {
  return true;
};
