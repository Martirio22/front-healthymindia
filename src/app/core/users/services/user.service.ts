import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { UserRequest } from '../models/user-request.model';
import { UserResponse } from '../models/user-response.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl =
    `${environment.apiUrl}/api/users`;

  getMyProfile(): Observable<UserResponse> {
    return this.http.get<UserResponse>(
      `${this.baseUrl}/me`
    );
  }

  updateMyProfile(
    request: UserRequest
  ): Observable<UserResponse> {
    return this.http.put<UserResponse>(
      `${this.baseUrl}/me`,
      request
    );
  }

  getAllUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(
      `${this.baseUrl}/`
    );
  }

  getUserById(id: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(
      `${this.baseUrl}/${id}`
    );
  }

  changeUserStatus(
    id: number
  ): Observable<UserResponse> {
    return this.http.patch<UserResponse>(
      `${this.baseUrl}/${id}/status`,
      null
    );
  }
}
