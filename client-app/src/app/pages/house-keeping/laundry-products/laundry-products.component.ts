import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HouseKeepingService } from '../../../services/house-keeping.service';

@Component({
  selector: 'app-laundry-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './laundry-products.component.html',
    styleUrls:['../house-keeping-shared.css']
})
export class LaundryProductsComponent implements OnInit {
  products: any[] = []; 

  constructor(private readonly hkService: HouseKeepingService) {}

  ngOnInit(): void {
    // এখানে আমরা লন্ড্রি লগ থেকে সামারি ডাটা বা প্রোডাক্ট ডাটা লোড করতে পারি
    this.hkService.getLaundryLogs().subscribe(res => {
      // ডেমো সামারাইজেশন বা ডিরেক্ট ইনভেন্টরি ম্যাপিং
      this.products = res; 
    });
  }
}