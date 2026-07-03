import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HouseKeepingService } from '../../../services/house-keeping.service';
import { CustomAlertService } from '../../../services/custom-alert.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-room-cleaning',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './room-cleaning.component.html',
  styleUrls: ['../house-keeping-shared.css']
})
export class RoomCleaningComponent implements OnInit {
  cleaningForm!: FormGroup;
  cleaningList: any[] = [];
  availableRooms: any[] = []; // 🚀 Real rooms collected from Backend
  isModalOpen = false;

  // 🚀 Defined Housekeeper list matching Assign Room Cleaning screen
  houseKeepers = [
    { id: 1, name: 'Rahul Sharma' },
    { id: 2, name: 'Amit Das' },
    { id: 3, name: 'Subrata Pal' },
    { id: 4, name: 'Vikram Singh' }
  ];

  statuses = ['Checked In', 'Ready', 'In Progress', 'Pending'];

  constructor(
    private readonly fb: FormBuilder,
    private readonly hkService: HouseKeepingService,
    private readonly alertService: CustomAlertService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAllData();
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  initForm(): void {
    this.cleaningForm = this.fb.group({
      id: [0],
      name: ['', Validators.required],     // Will map to Housekeeper Dropdown
      roomNo: ['', Validators.required],   // Will map to Rooms Dropdown
      date: [new Date().toISOString().substring(0, 10), Validators.required],
      status: ['Pending', Validators.required]
    });
  }

  // 🚀 Combines Cleanings list and Room list simultaneously
  loadAllData(): void {
    forkJoin({
      cleanings: this.hkService.getCleanings(),
      rooms: this.hkService.getRoomsWithFilter(1, 1000)
    }).subscribe({
      next: ({ cleanings, rooms }) => {
        // Handle variations of active cleaning records mapping ($values array format)
        if (cleanings && (cleanings as any).$values) {
          this.cleaningList = (cleanings as any).$values;
        } else if (Array.isArray(cleanings)) {
          this.cleaningList = cleanings;
        }

        // Handle rooms layout extraction safely
        let rawRooms: any[] = [];
        if (rooms && rooms.data) {
          rawRooms = Array.isArray(rooms.data) ? rooms.data : (rooms.data.$values || []);
        } else if (rooms && rooms.items) {
          rawRooms = Array.isArray(rooms.items) ? rooms.items : (rooms.items.$values || []);
        } else if (Array.isArray(rooms)) {
          rawRooms = rooms;
        }

        // Map the plain room numbers down to array strings for easy dropdown tracking
        this.availableRooms = rawRooms.map(r => (r.roomNumber || r.roomNo || r.no || '').toString()).filter(no => no !== '');
      },
      error: (err) => {
        console.error('Error fetching housekeeping data:', err);
        this.alertService.error('Failed to load screen data resources.');
      }
    });
  }

  openModal(data: any = null): void {
    this.isModalOpen = true;
    if (data) {
      this.cleaningForm.patchValue({
        id: data.id,
        name: data.name,
        roomNo: data.roomNo?.toString(),
        date: data.date ? data.date.substring(0, 10) : new Date().toISOString().substring(0, 10),
        status: data.status
      });
    } else {
      this.cleaningForm.reset({ 
        id: 0, 
        name: '',
        roomNo: '',
        status: 'Pending', 
        date: new Date().toISOString().substring(0, 10) 
      });
    }
  }

  saveRecord(): void {
    if (this.cleaningForm.invalid) {
      this.alertService.warning('Please complete all required form fields!');
      return;
    }

    const payload = { ...this.cleaningForm.value };
    // Force format datetime back to the expected ISO string structure format without zone offsets
    if (payload.date.length === 10) {
      const localTime = new Date();
      payload.date = `${payload.date}T${String(localTime.getHours()).padStart(2, '0')}:${String(localTime.getMinutes()).padStart(2, '0')}:${String(localTime.getSeconds()).padStart(2, '0')}`;
    }

    this.hkService.saveCleaning(payload).subscribe({
      next: (res) => {
        this.alertService.success('Cleaning record saved successfully!');
        this.closeModal();
        this.loadAllData();
      },
      error: (err) => {
        console.error('Save failed:', err);
        this.alertService.error('Failed to save cleaning logs.');
      }
    });
  }

  deleteRecord(id: number): void {
    if (confirm('Are you absolutely sure you want to delete this cleaning record?')) {
      this.hkService.deleteCleaning(id).subscribe({
        next: (res) => {
          this.alertService.success('Record removed successfully!');
          this.loadAllData();
        },
        error: (err) => {
          console.error('Delete error:', err);
          this.alertService.error('Could not complete log deletion.');
        }
      });
    }
  }
}