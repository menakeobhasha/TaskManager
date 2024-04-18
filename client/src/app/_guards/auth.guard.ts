import { CanActivateFn } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const toastr = inject(ToastrService);

  return authService.currentUser$.pipe(
    map(user => {
      if (user) return true;
      else {
        toastr.error('you shall not pass!');
        return false;
      }
    })
  )
};
