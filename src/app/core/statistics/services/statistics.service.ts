import { inject, Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { DashboardResponse } from '../models/dashboard-response.model';
import { WeeklyStatisticsResponse } from '../models/weekly-statistics-response.model';
import { MonthlyStatisticsResponse } from '../models/monthly-statistics-response.model';
import { DailyStatisticsResponse } from '../models/daily-statistics-response.model';
import { RangeStatisticsResponse } from '../models/range-statistics-response.model';
import { AiRecommendationResponse } from '../models/ai-recommendation-response.model';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl =
    `${environment.apiUrl}/api/statistics`;

  getDashboard(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(
      `${this.baseUrl}/dashboard`
    );
  }

  getWeeklyStatistics(): Observable<WeeklyStatisticsResponse> {
    return this.http.get<WeeklyStatisticsResponse>(
      `${this.baseUrl}/weekly`
    );
  }

  getMonthlyStatistics(): Observable<MonthlyStatisticsResponse> {
    return this.http.get<MonthlyStatisticsResponse>(
      `${this.baseUrl}/monthly`
    );
  }

  generateRecommendation():
    Observable<AiRecommendationResponse> {
    return this.http.post<AiRecommendationResponse>(
      `${this.baseUrl}/recommendation`,
      null
    );
  }

  getDailyStatistics(
    date: string
  ): Observable<DailyStatisticsResponse> {
    const params = new HttpParams()
      .set('date', date);

    return this.http.get<DailyStatisticsResponse>(
      `${this.baseUrl}/daily`,
      { params }
    );
  }

  getStatisticsByRange(
    startDate: string,
    endDate: string
  ): Observable<RangeStatisticsResponse> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    return this.http.get<RangeStatisticsResponse>(
      `${this.baseUrl}/range`,
      { params }
    );
  }

  getRecommendationHistory():
    Observable<AiRecommendationResponse[]> {
    return this.http.get<AiRecommendationResponse[]>(
      `${this.baseUrl}/recommendations`
    );
  }

  getRecommendationById(
    id: number
  ): Observable<AiRecommendationResponse> {
    return this.http.get<AiRecommendationResponse>(
      `${this.baseUrl}/recommendations/${id}`
    );
  }
}
