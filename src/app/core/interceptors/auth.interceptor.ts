import {
    HttpErrorResponse,
    HttpInterceptorFn
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {
    catchError,
    throwError
} from 'rxjs';

import { environment } from '../../../environments/environment';
import { TokenStorageService } from '../auth/services/token-storage.service';

export const authInterceptor: HttpInterceptorFn = (
    request,
    next
) => {
    const tokenStorage =
        inject(TokenStorageService);

    const router =
        inject(Router);

    const accessToken =
        tokenStorage.getAccessToken();

    const publicUrls = [
        `${environment.apiUrl}/api/auth/login`,
        `${environment.apiUrl}/api/auth/register`,
        `${environment.apiUrl}/api/auth/forgot-password`,
        `${environment.apiUrl}/api/auth/logout`
    ];

    const isPublicRequest =
        publicUrls.some(publicUrl =>
            request.url.startsWith(publicUrl)
        );

    const requestToSend =
        !isPublicRequest &&
        accessToken &&
        !tokenStorage.isTokenExpired()
            ? request.clone({
                  setHeaders: {
                      Authorization:
                          `Bearer ${accessToken}`
                  }
              })
            : request;

    return next(requestToSend).pipe(
        catchError(
            (error: HttpErrorResponse) => {
                if (
                    error.status === 401 &&
                    !isPublicRequest
                ) {
                    tokenStorage.clearSession();

                    void router.navigate([
                        '/auth/login'
                    ]);
                }

                return throwError(() => error);
            }
        )
    );
};
