import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiBaseUrl } from '../app.config';
import { DashboardSummary, OccupancyGridResponse } from '../models/dashboard.models';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly baseUrl = `${apiBaseUrl}/dashboard`;

  constructor(private readonly http: HttpClient) {}

  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.baseUrl}/summary`);
  }

  getSummaryFromApi(): Observable<DashboardSummary> {
    return this.getSummary();
  }

  getOccupancyGrid(
    fromDate: Date,
    toDate: Date,
    searchRoomNumber?: string
  ): Observable<OccupancyGridResponse> {
    let params = new HttpParams()
      .set('fromDate', fromDate.toISOString())
      .set('toDate', toDate.toISOString());

    if (searchRoomNumber) {
      params = params.set('searchRoomNumber', searchRoomNumber);
    }

    return this.http.get<OccupancyGridResponse>(`${this.baseUrl}/occupancy`, { params });
  }
}
