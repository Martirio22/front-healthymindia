import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
    finalize,
    Observable,
    of,
    tap
} from 'rxjs';

import { environment } from '../../../../environments/environment';

import { CreateUserByAdminRequest } from '../models/create-user-by-admin-request.model';
import { ForgotPasswordRequest } from '../models/forgot-password-request.model';
import { LoginRequest } from '../models/login-request.model';
import { LogoutRequest } from '../models/logout-request.model';
import { RegisterRequest } from '../models/register-request.model';
import { TokenResponse } from '../models/token-response.model';

import { TokenStorageService } from './token-storage.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly tokenStorage = inject(TokenStorageService);

    private readonly authUrl =
        `${environment.apiUrl}/api/auth`;

    private readonly adminUrl =
        `${environment.apiUrl}/api/admin`;

    login(
        request: LoginRequest
    ): Observable<TokenResponse> {
        return this.http
            .post<TokenResponse>(
                `${this.authUrl}/login`,
                request
            )
            .pipe(
                tap(response => {
                    this.tokenStorage.saveSession(response);
                })
            );
    }

    register(
        request: RegisterRequest
    ): Observable<void> {
        return this.http.post<void>(
            `${this.authUrl}/register`,
            request
        );
    }

    forgotPassword(
        request: ForgotPasswordRequest
    ): Observable<void> {
        return this.http.post<void>(
            `${this.authUrl}/forgot-password`,
            request
        );
    }

    createUserByAdmin(
        request: CreateUserByAdminRequest
    ): Observable<void> {
        return this.http.post<void>(
            `${this.adminUrl}/users`,
            request
        );
    }

    logout(): Observable<void> {
        const refreshToken =
            this.tokenStorage.getRefreshToken();

        if (!refreshToken) {
            this.tokenStorage.clearSession();
            return of(void 0);
        }

        const request: LogoutRequest = {
            refreshToken
        };

        return this.http
            .post<void>(
                `${this.authUrl}/logout`,
                request
            )
            .pipe(
                finalize(() => {
                    this.tokenStorage.clearSession();
                })
            );
    }

    isAuthenticated(): boolean {
        return (
            this.tokenStorage.hasAccessToken() &&
            !this.tokenStorage.isTokenExpired()
        );
    }
}
