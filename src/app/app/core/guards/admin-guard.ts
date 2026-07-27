import { TokenStorageService } from '@/app/core/auth/services/token-storage.service';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
    const tokenStorage = inject(TokenStorageService);
    const router = inject(Router);

    if (tokenStorage.hasRole('ADMIN')) {
        return true;
    }

    return router.createUrlTree(['/dashboard']);
};
