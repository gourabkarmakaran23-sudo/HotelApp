import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HouseKeepingService {
  private readonly baseUrl = 'http://localhost:5287/api';
  private readonly hkUrl = 'http://localhost:5287/api/HouseKeeping';

  constructor(private readonly http: HttpClient) {}

  // 1. Room API (Get all rooms)
  getRooms(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/room`);
  }

  // 🚀 নতুন যোগ করা হলো: Room Type এর আইডি দিয়ে ব্যাকএন্ড থেকে রুম ফিল্টার করার API
  getRoomsByRoomType(roomTypeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/room/by-roomtype/${roomTypeId}`);
  }

  // 2. Room Type API
  getRoomTypes(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/RoomType`);
  }

  // --- 1. Room Cleaning API Call ---
  getCleanings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.hkUrl}/cleanings`);
  }

  saveCleaning(dto: any): Observable<boolean> {
    return this.http.post<boolean>(`${this.hkUrl}/cleanings/save`, dto);
  }

  deleteCleaning(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.hkUrl}/cleanings/delete/${id}`);
  }

  // --- 2. Checklist API Call ---
  getChecklist(): Observable<any[]> {
    return this.http.get<any[]>(`${this.hkUrl}/checklist`);
  }

  saveChecklist(dto: any): Observable<boolean> {
    return this.http.post<boolean>(`${this.hkUrl}/checklist/save`, dto);
  }

  deleteChecklist(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.hkUrl}/checklist/delete/${id}`);
  }

  // --- 3. Laundry Logs API Call ---
  getLaundryLogs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.hkUrl}/laundry/logs`);
  }

  saveLaundryLog(dto: any): Observable<boolean> {
    return this.http.post<boolean>(`${this.hkUrl}/laundry/logs/save`, dto);
  }
  

  // --- 4. Laundry Payments API Call ---
  getLaundryPayments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.hkUrl}/laundry/payments`);
  }

  saveLaundryPayment(dto: any): Observable<boolean> {
    return this.http.post<boolean>(`${this.hkUrl}/laundry/payments/save`, dto);
  }

  // 🚀 ADD THIS MISSING METHOD FOR DELETING LOGS
  deleteLaundryLog(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.hkUrl}/laundry/logs/delete/${id}`);
  }

  
  deleteLaundryPayment(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.hkUrl}/laundry/payments/delete/${id}`);
  }
  

  getRoomQrCode(roomNo: string): Observable<Blob> {
    return this.http.get(`${this.hkUrl}/room-qr/${roomNo}`, { responseType: 'blob' });
  }
  // 🚀 ১০০% ফিক্সড এবং ক্লাসিক্যাল মেথড (HttpParams দিয়ে ক্লিন বাইন্ডিং)
  getRoomsWithFilter(pageNumber: number, pageSize: number, searchTerm: string = ''): Observable<any> {
    // ডাইনামিক প্যারামিটার তৈরি করা হচ্ছে যাতে নাল বা ফাঁকা ভ্যালু ব্যাকএন্ডে গিয়ে ৪০০ এরর না মারতে পারে
    let params = new HttpParams()
      .set('PageNumber', pageNumber.toString())
      .set('PageSize', pageSize.toString());

    // যদি সার্চ টার্ম সত্যিই থাকে তবেই প্যারামিটারে যোগ হবে, ফাঁকা থাকলে ইউআরএল ক্লিয়ার থাকবে
    if (searchTerm && searchTerm.trim() !== '') {
      params = params.set('SearchTerm', searchTerm.trim());
    }

    return this.http.get<any>(`${this.baseUrl}/room`, { params });
  }
}