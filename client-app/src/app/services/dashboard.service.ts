import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiBaseUrl } from '../app.config';
import { DashboardSummary, DashboardStats, RoomTypeBookingHistoryResponse, OccupancyGridResponse } from '../models/dashboard.models';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly baseUrl = `${apiBaseUrl}/dashboard`;

  constructor(private readonly http: HttpClient) {}

  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.baseUrl}/summary`);
  }

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/stats`);
  }

  getRoomTypeBookingHistory(fromDate: Date, toDate: Date): Observable<RoomTypeBookingHistoryResponse> {
    const params = new HttpParams()
      .set('fromDate', fromDate.toISOString())
      .set('toDate', toDate.toISOString());

    return this.http.get<RoomTypeBookingHistoryResponse>(`${this.baseUrl}/room-type-history`, { params });
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

  getOccupancyFromAsset(): Observable<OccupancyGridResponse> {
    return this.http.get<OccupancyGridResponse>('assets/dummy-occupancy.json');
  }
}
