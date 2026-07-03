import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HouseKeepingService } from '../../../services/house-keeping.service'; 
import { CustomAlertService } from '../../../services/custom-alert.service'; 
import { forkJoin } from 'rxjs'; // 🚀 Used to join both API calls concurrently

@Component({
  selector: 'app-assign-room-cleaning',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './assign-room-cleaning.component.html',
  styleUrls: ['../house-keeping-shared.css']
})
export class AssignRoomCleaningComponent implements OnInit {
  filterForm!: FormGroup;
  roomTypes: any[] = [];     
  floors: any[] = [];        

  houseKeepers = [
    { id: 1, name: 'Rahul Sharma' },
    { id: 2, name: 'Amit Das' },
    { id: 3, name: 'Subrata Pal' },
    { id: 4, name: 'Vikram Singh' }
  ];

  statuses = ['Checked In', 'Ready', 'In Progress'];

  constructor(
    private readonly fb: FormBuilder,
    private readonly hkService: HouseKeepingService,
    private readonly alertService: CustomAlertService 
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadRoomTypes();
    this.loadRooms('All'); 
  }

  initForm(): void {
    this.filterForm = this.fb.group({
      houseKeeper: ['', Validators.required],
      roomType: ['All'],
      status: ['In Progress', Validators.required]
    });

    this.filterForm.get('roomType')?.valueChanges.subscribe((selectedValue) => {
      this.loadRooms(selectedValue);
    });
  }

  loadRoomTypes(): void {
    this.hkService.getRoomTypes().subscribe({
      next: (res: any) => {
        if (res && res.success && res.data) {
          this.roomTypes = Array.isArray(res.data) ? res.data : (res.data.$values || []);
        } else if (res && res.$values) {
          this.roomTypes = res.$values;
        } else if (Array.isArray(res)) {
          this.roomTypes = res;
        }
      },
      error: (err) => console.error('RoomType Fetch Error:', err)
    });
  }

  // 🚀 FIXED: Combines Rooms and Cleanings API data simultaneously
  loadRooms(roomTypeSelection: any): void {
    const roomObservable = (roomTypeSelection === 'All' || !roomTypeSelection)
      ? this.hkService.getRoomsWithFilter(1, 1000)
      : this.hkService.getRoomsByRoomType(Number(roomTypeSelection));

    forkJoin({
      roomsRes: roomObservable,
      cleaningsRes: this.hkService.getCleanings()
    }).subscribe({
      next: ({ roomsRes, cleaningsRes }) => {
        console.log('Combined Rooms Response:', roomsRes);
        console.log('Combined Cleanings Response:', cleaningsRes);

        // 1. Safely extract Rooms list
        let rawRooms: any[] = [];
        if (roomsRes && roomsRes.data) {
          rawRooms = Array.isArray(roomsRes.data) ? roomsRes.data : (roomsRes.data.$values || []);
        } else if (roomsRes && roomsRes.items) {
          rawRooms = Array.isArray(roomsRes.items) ? roomsRes.items : (roomsRes.items.$values || []);
        } else if (Array.isArray(roomsRes)) {
          rawRooms = roomsRes;
        }

        // 2. Safely extract Cleaning Logs records
        let activeCleanings: any[] = [];
        if (cleaningsRes && (cleaningsRes as any).$values) {
          activeCleanings = (cleaningsRes as any).$values;
        } else if (Array.isArray(cleaningsRes)) {
          activeCleanings = cleaningsRes;
        }

        // 3. Map rooms and merge matching cleaning status and housekeeper name
        const mappedRooms = rawRooms.map(room => {
          const roomNumberStr = (room.roomNumber || room.roomNo || room.no || '').toString();
          
          // Find if there is a cleaning entry assigned for this room number
          const cleaningAssignment = activeCleanings.find(
            c => (c.roomNo || '').toString() === roomNumberStr
          );

          return {
            no: roomNumberStr,
            floorName: room.floorName || room.floor || 'General Floor',
            operationalStatus: room.status || 'Available', // Core status (e.g., Occupied, Available, Reserved)
            houseKeeperName: cleaningAssignment ? cleaningAssignment.name : null, // Assigned Housekeeper
            hkStatus: cleaningAssignment ? cleaningAssignment.status : null,       // Housekeeping status (e.g., In Progress, Ready)
            isSelected: false
          };
        });

        this.groupRoomsByFloor(mappedRooms);
      },
      error: (err) => {
        console.error('Error fetching combined room and cleaning info:', err);
        this.floors = [];
      }
    });
  }

  private groupRoomsByFloor(mappedRooms: any[]): void {
    if (!mappedRooms || mappedRooms.length === 0) {
      this.floors = [];
      return;
    }

    const grouped: { [key: string]: any[] } = {};
    mappedRooms.forEach(room => {
      if (!grouped[room.floorName]) {
        grouped[room.floorName] = [];
      }
      grouped[room.floorName].push(room);
    });

    this.floors = Object.keys(grouped).map(key => ({
      name: key,
      rooms: grouped[key]
    }));
  }

  assignRooms(): void {
    if (this.filterForm.invalid || !this.filterForm.value.houseKeeper) {
      this.alertService.warning('Please select a House Keeper first!');
      return;
    }

    const selectedRooms: any[] = [];
    this.floors.forEach(f => {
      f.rooms.forEach((r: any) => {
        if (r.isSelected) {
          selectedRooms.push(r);
        }
      });
    });

    if (selectedRooms.length === 0) {
      this.alertService.error('Please select at least one room checkbox from below!');
      return;
    }

    const targetStatus = this.filterForm.value.status;
    if (!targetStatus || targetStatus === 'Select Status') {
      this.alertService.warning('Please select a valid Status (e.g., Ready, In Progress)!');
      return;
    }

    let savedCount = 0;
    let hasError = false;

    selectedRooms.forEach(room => {
      const localDate = new Date();
      const formattedDate = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}T${String(localDate.getHours()).padStart(2, '0')}:${String(localDate.getMinutes()).padStart(2, '0')}:${String(localDate.getSeconds()).padStart(2, '0')}`;

      const payload = {
        id: 0,
        name: this.filterForm.value.houseKeeper, 
        roomNo: room.no.toString(),              
        date: formattedDate,                     
        status: targetStatus                     
      };

      console.log('Sending Cleaning Payload to Backend:', payload);

      this.hkService.saveCleaning(payload).subscribe({
        next: (res) => {
          savedCount++;
          room.hkStatus = targetStatus; 
          room.houseKeeperName = this.filterForm.value.houseKeeper;
          room.isSelected = false;   
          
          if (savedCount === selectedRooms.length && !hasError) {
            this.alertService.success('Room Cleaning Assigned & Status Updated successfully!', () => {
              this.loadRooms(this.filterForm.value.roomType);
            });
          }
        },
        error: (err) => {
          hasError = true;
          console.error(`Save failed for Room ${room.no}. Backend Error:`, err);
          this.alertService.error(`Failed to save assignment for Room ${room.no}. Please try again.`);
        }
      });
    });
  }

  cancelAssignment(): void {
    this.filterForm.reset({
      houseKeeper: '',
      roomType: 'All',
      status: 'In Progress'
    });
    this.loadRooms('All');
  }
}