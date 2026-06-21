import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { BandService } from '../band.service';

export const authGuard: CanActivateFn = () => {
  const bandService = inject(BandService);
  const router = inject(Router);

  if (bandService.currentUser()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
