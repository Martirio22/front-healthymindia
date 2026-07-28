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

    getMyHabits(): Observable<HabitResponse[]> {
        return this.http.get<HabitResponse[]>(
            this.baseUrl
        );
    }

    getHabitById(id: number): Observable<HabitResponse> {
        return this.http.get<HabitResponse>(
            `${this.baseUrl}/${id}`
        );
    }

    createHabit(
        request: HabitRequest
    ): Observable<HabitResponse> {
        return this.http.post<HabitResponse>(
            this.baseUrl,
            request
        );
    }

    updateHabit(
        id: number,
        request: HabitRequest
    ): Observable<HabitResponse> {
        return this.http.put<HabitResponse>(
            `${this.baseUrl}/${id}`,
            request
        );
    }

    changeHabitStatus(
        id: number
    ): Observable<HabitResponse> {
        return this.http.patch<HabitResponse>(
            `${this.baseUrl}/${id}/status`,
            null
        );
    }

    deleteHabit(id: number): Observable<void> {
        return this.http.delete<void>(
            `${this.baseUrl}/${id}`
        );
    }

    getHabitsByCategory(
        category: HabitCategory
    ): Observable<HabitResponse[]> {
        return this.http.get<HabitResponse[]>(
            `${this.baseUrl}/category/${category}`
        );
    }

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

    getHabitStatus(
        id: number
    ): Observable<HabitStatusResponse> {
        return this.http.get<HabitStatusResponse>(
            `${this.baseUrl}/${id}/status`
        );
    }

    createRecord(
        habitId: number,
        request: HabitRecordRequest
    ): Observable<HabitRecordResponse> {
        return this.http.post<HabitRecordResponse>(
            `${this.baseUrl}/${habitId}/records`,
            request
        );
    }

    updateRecord(
        recordId: number,
        request: UpdateHabitRecordRequest
    ): Observable<HabitRecordResponse> {
        return this.http.put<HabitRecordResponse>(
            `${this.baseUrl}/records/${recordId}`,
            request
        );
    }

    getTodayRecord(
        habitId: number
    ): Observable<HabitRecordResponse> {
        return this.http.get<HabitRecordResponse>(
            `${this.baseUrl}/${habitId}/records/today`
        );
    }

    getHabitHistory(
        habitId: number
    ): Observable<HabitRecordResponse[]> {
        return this.http.get<HabitRecordResponse[]>(
            `${this.baseUrl}/${habitId}/records`
        );
    }

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

    getRecordStatus(
        recordId: number
    ): Observable<HabitRecordStatusResponse> {
        return this.http.get<HabitRecordStatusResponse>(
            `${this.baseUrl}/records/${recordId}/status`
        );
    }

    deleteRecord(recordId: number): Observable<void> {
        return this.http.delete<void>(
            `${this.baseUrl}/records/${recordId}`
        );
    }

    getTodaySummary(): Observable<TodaySummaryResponse> {
        return this.http.get<TodaySummaryResponse>(
            `${this.baseUrl}/records/summary`
        );
    }

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

    getAllRecords(): Observable<HabitRecordResponse[]> {
        return this.http.get<HabitRecordResponse[]>(
            `${this.baseUrl}/records`
        );
    }
}
