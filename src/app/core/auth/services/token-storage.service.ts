import { Injectable } from '@angular/core';

import { TokenResponse } from '../models/token-response.model';

@Injectable({
    providedIn: 'root'
})
export class TokenStorageService {
    private readonly accessTokenKey =
        'access_token';

    private readonly refreshTokenKey =
        'refresh_token';

    private readonly accessTokenExpirationKey =
        'access_token_expires_at';

    private readonly refreshTokenExpirationKey =
        'refresh_token_expires_at';

    saveSession(
        tokenResponse: TokenResponse
    ): void {
        const now = Date.now();

        const accessExpiration =
            now +
            tokenResponse.expiresIn * 1000;

        const refreshExpiration =
            now +
            tokenResponse.refreshExpiresIn * 1000;

        localStorage.setItem(
            this.accessTokenKey,
            tokenResponse.accessToken
        );

        localStorage.setItem(
            this.refreshTokenKey,
            tokenResponse.refreshToken
        );

        localStorage.setItem(
            this.accessTokenExpirationKey,
            accessExpiration.toString()
        );

        localStorage.setItem(
            this.refreshTokenExpirationKey,
            refreshExpiration.toString()
        );
    }

    getAccessToken(): string | null {
        return localStorage.getItem(
            this.accessTokenKey
        );
    }

    getRefreshToken(): string | null {
        return localStorage.getItem(
            this.refreshTokenKey
        );
    }

    getExpirationTime(): number | null {
        return this.getStoredNumber(
            this.accessTokenExpirationKey
        );
    }

    getRefreshExpirationTime(): number | null {
        return this.getStoredNumber(
            this.refreshTokenExpirationKey
        );
    }

    getAccessTokenSecondsRemaining(): number {
        const expiration =
            this.getExpirationTime();

        if (!expiration) {
            return 0;
        }

        return Math.max(
            0,
            Math.ceil(
                (expiration - Date.now()) /
                    1000
            )
        );
    }

    getRefreshTokenSecondsRemaining(): number {
        const expiration =
            this.getRefreshExpirationTime();

        if (!expiration) {
            return 0;
        }

        return Math.max(
            0,
            Math.ceil(
                (expiration - Date.now()) /
                    1000
            )
        );
    }

    hasAccessToken(): boolean {
        return Boolean(
            this.getAccessToken()
        );
    }

    hasRefreshToken(): boolean {
        return Boolean(
            this.getRefreshToken()
        );
    }

    isTokenExpired(): boolean {
        return (
            this.getAccessTokenSecondsRemaining() <=
            0
        );
    }

    isRefreshTokenExpired(): boolean {
        return (
            this.getRefreshTokenSecondsRemaining() <=
            0
        );
    }

    clearSession(): void {
        localStorage.removeItem(
            this.accessTokenKey
        );

        localStorage.removeItem(
            this.refreshTokenKey
        );

        localStorage.removeItem(
            this.accessTokenExpirationKey
        );

        localStorage.removeItem(
            this.refreshTokenExpirationKey
        );
    }

    getTokenPayload():
        | Record<string, unknown>
        | null {
        const token =
            this.getAccessToken();

        if (!token) {
            return null;
        }

        try {
            const payload =
                token.split('.')[1];

            if (!payload) {
                return null;
            }

            const normalizedPayload =
                payload
                    .replace(/-/g, '+')
                    .replace(/_/g, '/');

            const paddedPayload =
                normalizedPayload.padEnd(
                    normalizedPayload.length +
                        ((4 -
                            normalizedPayload.length %
                                4) %
                            4),
                    '='
                );

            const decodedPayload =
                decodeURIComponent(
                    window
                        .atob(paddedPayload)
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

            return JSON.parse(
                decodedPayload
            ) as Record<string, unknown>;
        } catch {
            return null;
        }
    }

    getRoles(): string[] {
        const payload =
            this.getTokenPayload();

        if (!payload) {
            return [];
        }

        const realmAccess =
            payload['realm_access'];

        if (
            typeof realmAccess !==
                'object' ||
            realmAccess === null
        ) {
            return [];
        }

        const roles = (
            realmAccess as Record<
                string,
                unknown
            >
        )['roles'];

        if (!Array.isArray(roles)) {
            return [];
        }

        return roles
            .filter(
                (role): role is string =>
                    typeof role === 'string'
            )
            .map(role =>
                role.toUpperCase()
            );
    }

    hasRole(role: string): boolean {
        return this.getRoles().includes(
            role
                .toUpperCase()
                .replace('ROLE_', '')
        );
    }

    isAdmin(): boolean {
        return this.hasRole('ADMIN');
    }

    isUser(): boolean {
        return this.hasRole('USER');
    }

    private getStoredNumber(
        key: string
    ): number | null {
        const value =
            localStorage.getItem(key);

        if (!value) {
            return null;
        }

        const parsedValue =
            Number(value);

        return Number.isNaN(parsedValue)
            ? null
            : parsedValue;
    }
}
