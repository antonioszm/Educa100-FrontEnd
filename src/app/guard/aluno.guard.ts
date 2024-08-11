import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';

export const alunoGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.verificarSeForAluno()) {
    return true;
  } else {
    router.navigate(['/home']);
    return false;
  }
};
