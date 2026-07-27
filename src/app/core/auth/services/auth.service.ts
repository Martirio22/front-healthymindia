import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { LoginRequest } from '../models/login-request.model';
import { RegisterRequest } from '../models/register-request.model';
import { ForgotPasswordRequest } from '../models/forgot-password-request.model';
import { CreateUserByAdminRequest } from '../models/create-user-by-admin-request.model';
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

  /**
   * Endpoint público.
   * No requiere token.
   */
  login(request: LoginRequest): Observable<TokenResponse> {
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

  /**
   * Endpoint público.
   * No requiere token.
   */
  register(request: RegisterRequest): Observable<void> {
    return this.http.post<void>(
      `${this.authUrl}/register`,
      request
    );
  }

  /**
   * Endpoint público.
   * No requiere token.
   */
  forgotPassword(
    request: ForgotPasswordRequest
  ): Observable<void> {
    return this.http.post<void>(
      `${this.authUrl}/forgot-password`,
      request
    );
  }

  /**
   * Endpoint protegido.
   * Requiere token con rol ADMIN.
   */
  createUserByAdmin(
    request: CreateUserByAdminRequest
  ): Observable<void> {
    return this.http.post<void>(
      `${this.adminUrl}/users`,
      request
    );
  }

  logout(): void {
    this.tokenStorage.clearSession();
  }

  isAuthenticated(): boolean {
    return (
      this.tokenStorage.hasAccessToken() &&
      !this.tokenStorage.isTokenExpired()
    );
  }
}
