import { CanActivateFn } from '@angular/router';

export const logInAuthGuard: CanActivateFn = (route, state) => {
  return true;
};
