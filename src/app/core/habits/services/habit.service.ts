import { inject, Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { HabitCategory } from '../models/habit-category.enum';
import { HabitRequest } from '../models/habit-request.model';
import { HabitResponse } from '../models/habit-response.model';
import { HabitStatusResponse } from '../models/habit-status-response.model';

import { HabitRecordRequest } from '../models/habit-record-request.model';
import { UpdateHabitRecordRequest } from '../models/update-habit-record-request.model';
import { HabitRecordResponse } from '../models/habit-record-response.model';
import { HabitRecordStatusResponse } from '../models/habit-record-status-response.model';
import { TodaySummaryResponse } from '../models/today-summary-response.model';

@Injectable({
  providedIn: 'root'
})
export class HabitService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl =
    `${environment.apiUrl}/api/habits`;

  /**
   * GET /api/habits/
   * Requiere token.
   */
  getMyHabits(): Observable<HabitResponse[]> {
    return this.http.get<HabitResponse[]>(
      `${this.baseUrl}/`
    );
  }

  /**
   * GET /api/habits/{id}
   * Requiere token.
   */
  getHabitById(id: number): Observable<HabitResponse> {
    return this.http.get<HabitResponse>(
      `${this.baseUrl}/${id}`
    );
  }

  /**
   * POST /api/habits/
   * Requiere token.
   */
  createHabit(
    request: HabitRequest
  ): Observable<HabitResponse> {
    return this.http.post<HabitResponse>(
      `${this.baseUrl}/`,
      request
    );
  }

  /**
   * PUT /api/habits/{id}
   * Requiere token.
   */
  updateHabit(
    id: number,
    request: HabitRequest
  ): Observable<HabitResponse> {
    return this.http.put<HabitResponse>(
      `${this.baseUrl}/${id}`,
      request
    );
  }

  /**
   * PATCH /api/habits/{id}/status
   * Requiere token.
   */
  changeHabitStatus(
    id: number
  ): Observable<HabitResponse> {
    return this.http.patch<HabitResponse>(
      `${this.baseUrl}/${id}/status`,
      null
    );
  }

  /**
   * DELETE /api/habits/{id}
   * Requiere token.
   */
  deleteHabit(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/${id}`
    );
  }

  /**
   * GET /api/habits/category/{category}
   * Requiere token.
   */
  getHabitsByCategory(
    category: HabitCategory
  ): Observable<HabitResponse[]> {
    return this.http.get<HabitResponse[]>(
      `${this.baseUrl}/category/${category}`
    );
  }

  /**
   * GET /api/habits/search?query=...
   * Requiere token.
   */
  searchHabits(
    query: string
  ): Observable<HabitResponse[]> {
    const params = new HttpParams()
      .set('query', query.trim());

    return this.http.get<HabitResponse[]>(
      `${this.baseUrl}/search`,
      { params }
    );
  }

  /**
   * GET /api/habits/{id}/status
   * Requiere token.
   */
  getHabitStatus(
    id: number
  ): Observable<HabitStatusResponse> {
    return this.http.get<HabitStatusResponse>(
      `${this.baseUrl}/${id}/status`
    );
  }

  /**
   * POST /api/habits/{habitId}/records
   * Requiere token.
   */
  createRecord(
    habitId: number,
    request: HabitRecordRequest
  ): Observable<HabitRecordResponse> {
    return this.http.post<HabitRecordResponse>(
      `${this.baseUrl}/${habitId}/records`,
      request
    );
  }

  /**
   * PUT /api/habits/records/{recordId}
   * Requiere token.
   */
  updateRecord(
    recordId: number,
    request: UpdateHabitRecordRequest
  ): Observable<HabitRecordResponse> {
    return this.http.put<HabitRecordResponse>(
      `${this.baseUrl}/records/${recordId}`,
      request
    );
  }

  /**
   * GET /api/habits/{habitId}/records/today
   * Requiere token.
   */
  getTodayRecord(
    habitId: number
  ): Observable<HabitRecordResponse> {
    return this.http.get<HabitRecordResponse>(
      `${this.baseUrl}/${habitId}/records/today`
    );
  }

  /**
   * GET /api/habits/{habitId}/records
   * Requiere token.
   */
  getHabitHistory(
    habitId: number
  ): Observable<HabitRecordResponse[]> {
    return this.http.get<HabitRecordResponse[]>(
      `${this.baseUrl}/${habitId}/records`
    );
  }

  /**
   * GET /api/habits/{habitId}/records/range
   * Requiere token.
   */
  getHabitHistoryByRange(
    habitId: number,
    startDate: string,
    endDate: string
  ): Observable<HabitRecordResponse[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    return this.http.get<HabitRecordResponse[]>(
      `${this.baseUrl}/${habitId}/records/range`,
      { params }
    );
  }

  /**
   * GET /api/habits/records/{recordId}/status
   * Requiere token.
   */
  getRecordStatus(
    recordId: number
  ): Observable<HabitRecordStatusResponse> {
    return this.http.get<HabitRecordStatusResponse>(
      `${this.baseUrl}/records/${recordId}/status`
    );
  }

  /**
   * DELETE /api/habits/records/{recordId}
   * Requiere token.
   */
  deleteRecord(recordId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/records/${recordId}`
    );
  }

  /**
   * GET /api/habits/records/summary
   * Requiere token.
   */
  getTodaySummary(): Observable<TodaySummaryResponse> {
    return this.http.get<TodaySummaryResponse>(
      `${this.baseUrl}/records/summary`
    );
  }

  /**
   * GET /api/habits/records/summary?date=YYYY-MM-DD
   * Requiere token.
   */
  getSummaryByDate(
    date: string
  ): Observable<TodaySummaryResponse> {
    const params = new HttpParams()
      .set('date', date);

    return this.http.get<TodaySummaryResponse>(
      `${this.baseUrl}/records/summary`,
      { params }
    );
  }

  /**
   * GET /api/habits/records
   * Requiere token.
   */
  getAllRecords(): Observable<HabitRecordResponse[]> {
    return this.http.get<HabitRecordResponse[]>(
      `${this.baseUrl}/records`
    );
  }
}
