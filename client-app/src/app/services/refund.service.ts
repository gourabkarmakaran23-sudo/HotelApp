import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiBaseUrl } from '../app.config';

export enum RefundStatus {
  Due = 0,
  UnderProcess = 1,
  Refunded = 2
}

@Injectable({
  providedIn: 'root'
})
export class RefundService {
  private readonly baseUrl = `${apiBaseUrl}/Refund`;

  constructor(private readonly http: HttpClient) { }

  private getAuthHeaders() {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }

  // স্ট্যাটাস অনুযায়ী লিস্ট ডাটা লোড করার জন্য (0 = Due, 1 = Process, 2 = Refunded)
  getRefundsByStatus(status: RefundStatus): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}?status=${status}`, this.getAuthHeaders());
  }

  getRefundById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`, this.getAuthHeaders());
  }

  // ৩টি ফর্মেরই ডাটা সেভ বা এডিট করার জন্য
  saveRefundRecord(payload: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, payload, this.getAuthHeaders());
  }

  // লাইফসাইকেল স্টেজ চেঞ্জ করার জন্য (যেমন: Due থেকে Process-এ ট্রান্সফার করা)
  changeRefundStatus(id: number, status: RefundStatus): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}/change-status?status=${status}`, {}, this.getAuthHeaders());
  }

  deleteRefund(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`, this.getAuthHeaders());
  }
}