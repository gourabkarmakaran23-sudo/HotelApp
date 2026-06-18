import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiBaseUrl } from '../app.config';
import { CommissionAgent } from '../models/commission-agent.model';

@Injectable({
  providedIn: 'root'
})
export class MasterService {
  private readonly baseUrl = `${apiBaseUrl}/Master`; // Root prefix matching MasterController.cs

  constructor(private readonly http: HttpClient) { }

  // Helper function to dynamically append authorization headers
  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }

  //#region Currency Management
  getCurrencies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/currencies`, this.getAuthHeaders());
  }

  getCurrency(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/currencies/${id}`, this.getAuthHeaders());
  }

  createCurrency(currencyPayload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/currencies`, currencyPayload, this.getAuthHeaders());
  }

  updateCurrency(id: number, currencyPayload: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/currencies/${id}`, currencyPayload, this.getAuthHeaders());
  }

  deleteCurrency(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/currencies/${id}`, this.getAuthHeaders());
  }
  //#endregion

  //#region Payment Methods
  getPaymentMethods(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/payment-methods`, this.getAuthHeaders());
  }
  // ... (Keep your payment methods intact, just add this.getAuthHeaders() to them)

  // Bed Type Integration Endpoints
  getBedTypes(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/bed-types`, this.getAuthHeaders()); }
  createBedType(payload: any): Observable<number> { return this.http.post<number>(`${this.baseUrl}/bed-types`, payload, this.getAuthHeaders()); }
  updateBedType(id: number, payload: any): Observable<boolean> { return this.http.put<boolean>(`${this.baseUrl}/bed-types/${id}`, payload, this.getAuthHeaders()); }
  deleteBedType(id: number): Observable<boolean> { return this.http.delete<boolean>(`${this.baseUrl}/bed-types/${id}`, this.getAuthHeaders()); }

  // Booking Type Integration Endpoints
  getBookingTypes(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/booking-types`, this.getAuthHeaders()); }
  createBookingType(payload: any): Observable<number> { return this.http.post<number>(`${this.baseUrl}/booking-types`, payload, this.getAuthHeaders()); }
  updateBookingType(id: number, payload: any): Observable<boolean> { return this.http.put<boolean>(`${this.baseUrl}/booking-types/${id}`, payload, this.getAuthHeaders()); }
  deleteBookingType(id: number): Observable<boolean> { return this.http.delete<boolean>(`${this.baseUrl}/booking-types/${id}`, this.getAuthHeaders()); }

  // Booking Source Integration Endpoints
  getBookingSources(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/booking-sources`, this.getAuthHeaders()); }
  createBookingSource(payload: any): Observable<number> { return this.http.post<number>(`${this.baseUrl}/booking-sources`, payload, this.getAuthHeaders()); }
  updateBookingSource(id: number, payload: any): Observable<boolean> { return this.http.put<boolean>(`${this.baseUrl}/booking-sources/${id}`, payload, this.getAuthHeaders()); }
  deleteBookingSource(id: number): Observable<boolean> { return this.http.delete<boolean>(`${this.baseUrl}/booking-sources/${id}`, this.getAuthHeaders()); }

  // Complementary Integration Endpoints (FIXED PLURAL PATH: complementary -> complementaries)
  getComplementaries(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/complementaries`, this.getAuthHeaders()); }
  createComplementary(payload: any): Observable<number> { return this.http.post<number>(`${this.baseUrl}/complementaries`, payload, this.getAuthHeaders()); }
  updateComplementary(id: number, payload: any): Observable<boolean> { return this.http.put<boolean>(`${this.baseUrl}/complementaries/${id}`, payload, this.getAuthHeaders()); }
  deleteComplementary(id: number): Observable<boolean> { return this.http.delete<boolean>(`${this.baseUrl}/complementaries/${id}`, this.getAuthHeaders()); }

  // Floor Plan Integration Endpoints (FIXED HYPHENATION TO MATCH CONTROLLER ENDPOINTS)
  getFloorPlans(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/floor-plans`, this.getAuthHeaders()); }
  createFloorPlan(payload: any): Observable<number> { return this.http.post<number>(`${this.baseUrl}/floor-plans`, payload, this.getAuthHeaders()); }
  updateFloorPlan(id: number, payload: any): Observable<boolean> { return this.http.put<boolean>(`${this.baseUrl}/floor-plans/${id}`, payload, this.getAuthHeaders()); }
  deleteFloorPlan(id: number): Observable<boolean> { return this.http.delete<boolean>(`${this.baseUrl}/floor-plans/${id}`, this.getAuthHeaders()); }
}