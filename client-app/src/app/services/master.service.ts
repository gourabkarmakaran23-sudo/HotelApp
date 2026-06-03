import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiBaseUrl } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class MasterService {
  private readonly baseUrl = `${apiBaseUrl}/master`; // Adjust base URL path context if needed

  constructor(private readonly http: HttpClient) { }

  /**
   * Fetch all currencies from backend database
   */
  getCurrencies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/currencies`);
  }

  /**
   * Fetch single currency details by tracking ID
   */
  getCurrency(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/currencies/${id}`);
  }

  /**
   * Send a POST request to create a brand new currency row
   */
  createCurrency(currencyPayload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/currencies`, currencyPayload);
  }

  /**
   * Send a PUT request to update properties of an existing currency entry
   */
  updateCurrency(id: number, currencyPayload: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/currencies/${id}`, currencyPayload);
  }

  /**
   * Send a DELETE request to mark a currency tracking entry as removed
   */
  deleteCurrency(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/currencies/${id}`);
  }

  // ... (keep currency functions intact) ...

  //#region Payment Methods
  getPaymentMethods(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/payment-methods`);
  }

  createPaymentMethod(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/payment-methods`, payload);
  }

  updatePaymentMethod(id: number, payload: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/payment-methods/${id}`, payload);
  }

  deletePaymentMethod(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/payment-methods/${id}`);
  }
  //#endregion
}