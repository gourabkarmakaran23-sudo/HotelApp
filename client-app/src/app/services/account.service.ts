import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiBaseUrl } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly baseUrl = `${apiBaseUrl}/Account`;

  constructor(private readonly http: HttpClient) { }

  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }

  getOpeningBalances(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/opening-balances`, this.getAuthHeaders());
  }

  createOpeningBalance(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/opening-balances`, payload, this.getAuthHeaders());
  }

  updateOpeningBalance(id: number, payload: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/opening-balances/${id}`, payload, this.getAuthHeaders());
  }

  deleteOpeningBalance(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/opening-balances/${id}`, this.getAuthHeaders());
  }
}