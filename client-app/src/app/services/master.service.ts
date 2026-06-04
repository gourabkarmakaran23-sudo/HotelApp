import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiBaseUrl } from '../app.config';
import { CommissionAgent } from '../models/commission-agent.model';

@Injectable({
  providedIn: 'root'
})
export class MasterService {
  private readonly baseUrl = `${apiBaseUrl}/Master`; // Root prefix matching MasterController.cs

  constructor(private readonly http: HttpClient) { }

  //#region Currency Management
  getCurrencies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/currencies`);
  }

  getCurrency(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/currencies/${id}`);
  }

  createCurrency(currencyPayload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/currencies`, currencyPayload);
  }

  updateCurrency(id: number, currencyPayload: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/currencies/${id}`, currencyPayload);
  }

  deleteCurrency(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/currencies/${id}`);
  }
  //#endregion

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

  //#region Commission Agent Profile Management
  getAgents(): Observable<CommissionAgent[]> {
    return this.http.get<CommissionAgent[]>(`${this.baseUrl}/commission-agents`);
  }

  getAgentById(id: number): Observable<CommissionAgent> {
    return this.http.get<CommissionAgent>(`${this.baseUrl}/commission-agents/${id}`);
  }

  createAgent(agent: CommissionAgent): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/commission-agents`, agent);
  }

  updateAgent(id: number, agent: CommissionAgent): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/commission-agents/${id}`, agent);
  }

  deleteAgent(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/commission-agents/${id}`);
  }
  //#endregion

  //#region Agent Commissions Logs (New Layout Feature)
  getAgentCommissions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/agent-commissions`);
  }

  getAgentCommissionById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/agent-commissions/${id}`);
  }

  createAgentCommission(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/agent-commissions`, payload);
  }

  updateAgentCommission(id: number, payload: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/agent-commissions/${id}`, payload);
  }

  deleteAgentCommission(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/agent-commissions/${id}`);
  }
  //#endregion

  //#region Financial Year Operations Boundaries (New Layout Feature)
  getFinancialYears(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/financial-years`);
  }

  getFinancialYearById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/financial-years/${id}`);
  }

  createFinancialYear(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/financial-years`, payload);
  }

  updateFinancialYear(id: number, payload: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/financial-years/${id}`, payload);
  }

  deleteFinancialYear(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/financial-years/${id}`);
  }
  //#endregion
}