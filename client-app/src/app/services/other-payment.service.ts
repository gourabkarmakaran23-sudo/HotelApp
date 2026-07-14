import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiBaseUrl } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class OtherPaymentService {
  private readonly baseUrl = `${apiBaseUrl}/OtherPayment`;

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

  getInvoices(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl, this.getAuthHeaders());
  }

  getInvoiceById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`, this.getAuthHeaders());
  }

  createInvoice(payload: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, payload, this.getAuthHeaders());
  }

  deleteInvoice(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/${id}`, this.getAuthHeaders());
  }
}