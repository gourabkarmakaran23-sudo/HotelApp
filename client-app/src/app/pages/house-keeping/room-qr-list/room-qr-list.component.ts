import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HouseKeepingService } from '../../../services/house-keeping.service';

@Component({
  selector: 'app-room-qr-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './room-qr-list.component.html',
    styleUrls:['../house-keeping-shared.css']
})
export class RoomQrListComponent implements OnInit {
  // আপনার রুম টেবিল থেকে আসা রুম নম্বরগুলোর মক লিস্ট (যা ডাটাবেজে আছে)
  rooms = ['101', '102', '103', '104', '105']; 
  qrImages: { [roomNo: string]: SafeUrl } = {};

  constructor(
    private readonly hkService: HouseKeepingService,
    private readonly sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadAllRoomQrs();
  }

  loadAllRoomQrs(): void {
    this.rooms.forEach(room => {
      this.hkService.getRoomQrCode(room).subscribe({
        next: (blob: Blob) => {
          const objectURL = URL.createObjectURL(blob);
          this.qrImages[room] = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        },
        error: (err) => console.error(`Failed to load QR for room ${room}`, err)
      });
    });
  }
}