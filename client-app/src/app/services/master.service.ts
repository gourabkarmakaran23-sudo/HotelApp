import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiBaseUrl } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class MasterService {
  private readonly baseUrl = `${apiBaseUrl}/Master`;

  constructor(private readonly http: HttpClient) { }

  // Helper method to dynamically pull authorization tokens 
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

  createPaymentMethod(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/payment-methods`, payload, this.getAuthHeaders());
  }

  updatePaymentMethod(id: number, payload: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/payment-methods/${id}`, payload, this.getAuthHeaders());
  }

  deletePaymentMethod(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/payment-methods/${id}`, this.getAuthHeaders());
  }
  //#endregion

  //#region Commission Agent Management
  getAgents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/agents`, this.getAuthHeaders());
  }

  createAgent(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/agents`, payload, this.getAuthHeaders());
  }

  updateAgent(id: number, payload: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/agents/${id}`, payload, this.getAuthHeaders());
  }

  deleteAgent(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/agents/${id}`, this.getAuthHeaders());
  }
  //#endregion

  //#region Agent Commissions
  getAgentCommissions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/agent-commissions`, this.getAuthHeaders());
  }

  createAgentCommission(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/agent-commissions`, payload, this.getAuthHeaders());
  }

  updateAgentCommission(id: number, payload: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/agent-commissions/${id}`, payload, this.getAuthHeaders());
  }

  deleteAgentCommission(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/agent-commissions/${id}`, this.getAuthHeaders());
  }
  //#endregion

  //#region Financial Years
  getFinancialYears(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/financial-years`, this.getAuthHeaders());
  }

  createFinancialYear(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/financial-years`, payload, this.getAuthHeaders());
  }

  updateFinancialYear(id: number, payload: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/financial-years/${id}`, payload, this.getAuthHeaders());
  }

  deleteFinancialYear(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/financial-years/${id}`, this.getAuthHeaders());
  }
  //#endregion

  //#region Purchase Items
  getPurchaseItems(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/purchase-items`, this.getAuthHeaders());
  }

  createPurchaseItem(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/purchase-items`, payload, this.getAuthHeaders());
  }

  updatePurchaseItem(id: number, payload: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/purchase-items/${id}`, payload, this.getAuthHeaders());
  }

  deletePurchaseItem(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/purchase-items/${id}`, this.getAuthHeaders());
  }
  //#endregion

  //#region Purchase Returns
  getPurchaseReturns(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/purchase-returns`, this.getAuthHeaders());
  }

  createPurchaseReturn(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/purchase-returns`, payload, this.getAuthHeaders());
  }

  updatePurchaseReturn(id: number, payload: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/purchase-returns/${id}`, payload, this.getAuthHeaders());
  }

  deletePurchaseReturn(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/purchase-returns/${id}`, this.getAuthHeaders());
  }
  //#endregion

  //#region Stock Management
  getStockReport(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/stock-report`, this.getAuthHeaders());
  }

  getStockDetails(itemName: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/stock-details/${encodeURIComponent(itemName)}`, this.getAuthHeaders());
  }
  //#endregion

  //#region Wake Up Calls
  getWakeUpCalls(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/wake-up-calls`, this.getAuthHeaders());
  }

  createWakeUpCall(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/wake-up-calls`, payload, this.getAuthHeaders());
  }

  updateWakeUpCall(id: number, payload: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/wake-up-calls/${id}`, payload, this.getAuthHeaders());
  }

  deleteWakeUpCall(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/wake-up-calls/${id}`, this.getAuthHeaders());
  }
  //#endregion

  //#region Bed Types
  getBedTypes(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/bed-types`, this.getAuthHeaders()); }
  createBedType(payload: any): Observable<number> { return this.http.post<number>(`${this.baseUrl}/bed-types`, payload, this.getAuthHeaders()); }
  updateBedType(id: number, payload: any): Observable<boolean> { return this.http.put<boolean>(`${this.baseUrl}/bed-types/${id}`, payload, this.getAuthHeaders()); }
  deleteBedType(id: number): Observable<boolean> { return this.http.delete<boolean>(`${this.baseUrl}/bed-types/${id}`, this.getAuthHeaders()); }
  //#endregion

  //#region Booking Configurations
  getBookingTypes(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/booking-types`, this.getAuthHeaders()); }
  createBookingType(payload: any): Observable<number> { return this.http.post<number>(`${this.baseUrl}/booking-types`, payload, this.getAuthHeaders()); }
  updateBookingType(id: number, payload: any): Observable<boolean> { return this.http.put<boolean>(`${this.baseUrl}/booking-types/${id}`, payload, this.getAuthHeaders()); }
  deleteBookingType(id: number): Observable<boolean> { return this.http.delete<boolean>(`${this.baseUrl}/booking-types/${id}`, this.getAuthHeaders()); }

  getBookingSources(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/booking-sources`, this.getAuthHeaders()); }
  createBookingSource(payload: any): Observable<number> { return this.http.post<number>(`${this.baseUrl}/booking-sources`, payload, this.getAuthHeaders()); }
  updateBookingSource(id: number, payload: any): Observable<boolean> { return this.http.put<boolean>(`${this.baseUrl}/booking-sources/${id}`, payload, this.getAuthHeaders()); }
  deleteBookingSource(id: number): Observable<boolean> { return this.http.delete<boolean>(`${this.baseUrl}/booking-sources/${id}`, this.getAuthHeaders()); }
  //#endregion

  //#region Complementary & Floor Plans
  getComplementaries(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/complementaries`, this.getAuthHeaders()); }
  createComplementary(payload: any): Observable<number> { return this.http.post<number>(`${this.baseUrl}/complementaries`, payload, this.getAuthHeaders()); }
  updateComplementary(id: number, payload: any): Observable<boolean> { return this.http.put<boolean>(`${this.baseUrl}/complementaries/${id}`, payload, this.getAuthHeaders()); }
  deleteComplementary(id: number): Observable<boolean> { return this.http.delete<boolean>(`${this.baseUrl}/complementaries/${id}`, this.getAuthHeaders()); }

  getFloorPlans(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/floor-plans`, this.getAuthHeaders()); }
  createFloorPlan(payload: any): Observable<number> { return this.http.post<number>(`${this.baseUrl}/floor-plans`, payload, this.getAuthHeaders()); }
  updateFloorPlan(id: number, payload: any): Observable<boolean> { return this.http.put<boolean>(`${this.baseUrl}/floor-plans/${id}`, payload, this.getAuthHeaders()); }
  deleteFloorPlan(id: number): Observable<boolean> { return this.http.delete<boolean>(`${this.baseUrl}/floor-plans/${id}`, this.getAuthHeaders()); }
  //#endregion
}