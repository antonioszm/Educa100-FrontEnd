import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';

export const docenteGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.verificarSeForDocente()) {
    return true;
  } else {
    router.navigate(['/home']);
    return false;
  }
};
