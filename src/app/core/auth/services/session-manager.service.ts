import {
    Injectable,
    inject,
    signal
} from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from './auth.service';
import { TokenStorageService } from './token-storage.service';

@Injectable({
    providedIn: 'root'
})
export class SessionManagerService {
    private readonly authService =
        inject(AuthService);

    private readonly tokenStorage =
        inject(TokenStorageService);

    private readonly router =
        inject(Router);

    private timerId: number | null =
        null;

    private expiringSession = false;

    readonly dialogVisible =
        signal(false);

    readonly secondsRemaining =
        signal(30);

    readonly refreshing =
        signal(false);

    readonly errorMessage =
        signal('');

    start(): void {
        this.stopTimer();

        if (
            !this.tokenStorage
                .hasAccessToken()
        ) {
            return;
        }

        this.checkExpiration();

        this.timerId =
            window.setInterval(() => {
                this.checkExpiration();
            }, 1000);
    }

    stop(): void {
        this.stopTimer();

        this.dialogVisible.set(false);
        this.secondsRemaining.set(30);
        this.refreshing.set(false);
        this.errorMessage.set('');
        this.expiringSession = false;
    }

    keepSession(): void {
        if (this.refreshing()) {
            return;
        }

        const refreshToken =
            this.tokenStorage
                .getRefreshToken();

        if (
            !refreshToken ||
            this.tokenStorage
                .isRefreshTokenExpired()
        ) {
            this.expireSession();

            return;
        }

        this.refreshing.set(true);
        this.errorMessage.set('');

        this.authService
            .refreshToken()
            .pipe(
                finalize(() => {
                    this.refreshing.set(
                        false
                    );
                })
            )
            .subscribe({
                next: () => {
                    this.dialogVisible.set(
                        false
                    );

                    this.secondsRemaining.set(
                        30
                    );

                    this.errorMessage.set('');

                    this.start();
                },

                error: () => {
                    this.errorMessage.set(
                        'No fue posible renovar la sesión.'
                    );

                    window.setTimeout(() => {
                        this.expireSession();
                    }, 1200);
                }
            });
    }

    closeSession(): void {
        this.expireSession();
    }

    private checkExpiration(): void {
        if (
            this.expiringSession ||
            this.refreshing()
        ) {
            return;
        }

        const remaining =
            this.tokenStorage
                .getAccessTokenSecondsRemaining();

        if (remaining <= 0) {
            this.expireSession();

            return;
        }

        if (remaining <= 30) {
            this.secondsRemaining.set(
                remaining
            );

            this.dialogVisible.set(true);

            return;
        }

        this.dialogVisible.set(false);
    }

    private expireSession(): void {
        if (this.expiringSession) {
            return;
        }

        this.expiringSession = true;

        this.stopTimer();

        this.dialogVisible.set(false);

        this.authService
            .logout()
            .subscribe({
                next: () => {
                    this.finishLogout();
                },

                error: () => {
                    this.finishLogout();
                }
            });
    }

    private finishLogout(): void {
        this.stop();

        void this.router.navigate(
            ['/auth/login'],
            {
                replaceUrl: true,
                queryParams: {
                    reason:
                        'session-expired'
                }
            }
        );
    }

    private stopTimer(): void {
        if (this.timerId !== null) {
            window.clearInterval(
                this.timerId
            );

            this.timerId = null;
        }
    }
}
