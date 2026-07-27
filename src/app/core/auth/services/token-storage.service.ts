import { Injectable } from '@angular/core';
import { TokenResponse } from '../models/token-response.model';

@Injectable({
    providedIn: 'root'
})
export class TokenStorageService {
    private readonly accessTokenKey = 'access_token';
    private readonly refreshTokenKey = 'refresh_token';
    private readonly tokenExpirationKey = 'access_token_expires_at';

    saveSession(tokenResponse: TokenResponse): void {
        const expirationDate =
            Date.now() + tokenResponse.expiresIn * 1000;

        localStorage.setItem(
            this.accessTokenKey,
            tokenResponse.accessToken
        );

        if (tokenResponse.refreshToken) {
            localStorage.setItem(
                this.refreshTokenKey,
                tokenResponse.refreshToken
            );
        } else {
            localStorage.removeItem(this.refreshTokenKey);
        }

        localStorage.setItem(
            this.tokenExpirationKey,
            expirationDate.toString()
        );
    }

    getAccessToken(): string | null {
        return localStorage.getItem(this.accessTokenKey);
    }

    getRefreshToken(): string | null {
        return localStorage.getItem(this.refreshTokenKey);
    }

    getExpirationTime(): number | null {
        const expiration = localStorage.getItem(
            this.tokenExpirationKey
        );

        if (!expiration) {
            return null;
        }

        const expirationNumber = Number(expiration);

        return Number.isNaN(expirationNumber)
            ? null
            : expirationNumber;
    }

    hasAccessToken(): boolean {
        return Boolean(this.getAccessToken());
    }

    isTokenExpired(): boolean {
        const expiration = this.getExpirationTime();

        if (!expiration) {
            return true;
        }

        return Date.now() >= expiration;
    }

    clearSession(): void {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.tokenExpirationKey);
    }

    getTokenPayload(): Record<string, unknown> | null {
        const token = this.getAccessToken();

        if (!token) {
            return null;
        }

        try {
            const payload = token.split('.')[1];

            if (!payload) {
                return null;
            }

            const normalizedPayload = payload
                .replace(/-/g, '+')
                .replace(/_/g, '/');

            const decodedPayload = decodeURIComponent(
                window
                    .atob(normalizedPayload)
                    .split('')
                    .map(character =>
                        `%${(
                            '00' +
                            character
                                .charCodeAt(0)
                                .toString(16)
                        ).slice(-2)}`
                    )
                    .join('')
            );

            return JSON.parse(decodedPayload) as Record<
                string,
                unknown
            >;
        } catch {
            return null;
        }
    }

    getRoles(): string[] {
        const payload = this.getTokenPayload();

        if (!payload) {
            return [];
        }

        const realmAccess = payload['realm_access'];

        if (
            typeof realmAccess !== 'object' ||
            realmAccess === null
        ) {
            return [];
        }

        const roles = (
            realmAccess as Record<string, unknown>
        )['roles'];

        if (!Array.isArray(roles)) {
            return [];
        }

        return roles
            .filter(
                (role): role is string =>
                    typeof role === 'string'
            )
            .map(role => role.toUpperCase());
    }

    hasRole(role: string): boolean {
        return this.getRoles().includes(
            role.toUpperCase().replace('ROLE_', '')
        );
    }

    isAdmin(): boolean {
        return this.hasRole('ADMIN');
    }

    isUser(): boolean {
        return this.hasRole('USER');
    }
}
