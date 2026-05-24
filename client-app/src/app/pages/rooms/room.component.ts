import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Room, RoomService } from '../../services/room.service';
import { RoomTypeService } from '../../services/room-type.service';
import { CustomAlertService } from '../../services/custom-alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  rooms: any[] = [];
  filteredRooms: any[] = []; // Array bound to the HTML *ngFor table template
  roomTypesList: any[] = [];
  isModalOpen = false;
  isEditMode = false;
  selectedId = 0;
  roomForm!: FormGroup;

  
allRooms: any[] = [];          // Will hold the items returned from pagination
   
searchQuery: string = ''
  constructor(
    private fb: FormBuilder,
    private roomService: RoomService,
    private roomTypeService: RoomTypeService,
    private alertService: CustomAlertService,
    private router: Router
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadRoomTypes();
    this.loadRoomsList();
  }

  initForm(): void {
    this.roomForm = this.fb.group({
      roomNumber: ['', Validators.required],
      roomTypesId: ['', [Validators.required, Validators.min(1)]], // Changed default to empty string for placeholder match
      floorNo: ['', [Validators.required, Validators.min(0)]],
      price: ['', [Validators.required, Validators.min(0)]],
      status: ['Available', Validators.required],
      description: ['']
    });
  }

  // loadRoomTypes(): void {
  //   this.roomTypeService.getAll().subscribe({
  //     // Notice the type definition change to (res: any) right here:
  //     next: (res: any) => {
  //       console.log('Room Types API Response:', res);

  //       if (Array.isArray(res)) {
  //         this.roomTypesList = res;
  //       } else if (res && Array.isArray(res.data)) {
  //         this.roomTypesList = res.data;
  //       } else if (res && Array.isArray(res.items)) {
  //         this.roomTypesList = res.items;
  //       } else if (res && res.$values) {
  //         this.roomTypesList = res.$values;
  //       } else {
  //         this.roomTypesList = [];
  //       }

  //       this.loadRooms();
  //     },
  //     error: (err) => {
  //       console.error('Failed to load room types:', err);
  //     }
  //   });
  // }

  loadRoomTypes(): void {
  this.roomTypeService.getAll().subscribe({
    next: (res: any) => {
      console.log('Room Types API Response:', res);

      if (Array.isArray(res)) {
        this.roomTypesList = res;
      } else if (res && Array.isArray(res.data)) {
        this.roomTypesList = res.data; // Matches your console log: res.data holds the array
      } else if (res && Array.isArray(res.items)) {
        this.roomTypesList = res.items;
      } else if (res && res.$values) {
        this.roomTypesList = res.$values;
      } else {
        this.roomTypesList = [];
      }

      // FIX 1: Trigger the new pagination loader instead of the old loadRooms()
      this.loadRoomsList();
    },
    error: (err) => {
      console.error('Failed to load room types:', err);
    }
  });
}


  loadRoomsList(): void {
  // Pass required pagination defaults matching the backend filter expectations
  this.roomService.getAll(1, 50, this.searchQuery).subscribe({
    next: (response: any) => { // using 'any' or 'PageResult<Room>' depending on your types
      // Safely access the paginated list collection from the wrapper
      this.allRooms = response.items || [];
      console.log('Rooms API Response:', response.items);
      this.applyFilteringEngine();
    },
    error: (err) => {
      console.error(err);
      this.alertService.error('Failed to load rooms.');
    }
  });
}
// 3. The engine mapping room names and setting up template array visibility
applyFilteringEngine(): void {
  if (!this.allRooms || !this.roomTypesList) return;

  // Map backend room type IDs to names
  this.allRooms.forEach(room => {
    const match = this.roomTypesList.find(t => t.id === Number(room.roomTypesId || room.roomTypeId));
    room.roomTypeName = match ? match.name : 'Unknown';
    
  });

  // Assign directly to the array feeding your *ngFor table view
  this.filteredRooms = [...this.allRooms];
}


  loadRooms(): void {
    this.roomService.getAll().subscribe({
      next: (response: any) => {
        let extractedList: any[] = [];

        if (response && Array.isArray(response.data)) {
          extractedList = response.data;
        } else if (Array.isArray(response)) {
          extractedList = response;
        }

        this.rooms = extractedList;
        this.filteredRooms = extractedList;
        this.mapRoomTypeNames();
      },
      error: (err) => {
        console.error(err);
        this.alertService.error('Failed to load rooms.');
      }
    });
  }

  mapRoomTypeNames(): void {
    if (!this.filteredRooms || !this.roomTypesList) return;

    this.filteredRooms.forEach(room => {
      const match = this.roomTypesList.find(t => t.id === Number(room.roomTypesId));
      room.roomTypeName = match ? match.name : 'Unknown';
    });
  }

  onSearch(event: any): void {
    const value = event.target.value.toLowerCase().trim();
    if (!value) {
      this.filteredRooms = [...this.rooms];
    } else {
      this.filteredRooms = this.rooms.filter(room =>
        (room.roomNumber && room.roomNumber.toString().toLowerCase().includes(value)) ||
        (room.roomTypeName && room.roomTypeName.toLowerCase().includes(value))
      );
    }
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.selectedId = 0;
    this.roomForm.reset({
      roomNumber: '',
      roomTypesId: '',
      floorNo: '',
      price: '',
      status: 'Available',
      description: ''
    });
    this.isModalOpen = true;
  }

  openEditModal(room: any): void {
    this.isEditMode = true;
    this.selectedId = room.id;
    this.roomForm.patchValue({
      roomNumber: room.roomNumber,
      roomTypesId: room.roomTypesId,
      floorNo: room.floorNo,
      price: room.price,
      status: room.status,
      description: room.description
    });
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }
  onSubmit(): void {
    if (this.roomForm.invalid) {
      return;
    }

    // Build the payload explicitly matching C# properties
    const formValues = this.roomForm.value;

    const payload: any = {
      roomNumber: formValues.roomNumber,

      // 1. Supply BOTH ID properties so the backend validator passes
      roomTypeId: Number(formValues.roomTypesId),
      roomTypesId: Number(formValues.roomTypesId),

      // 2. Use exact property casing expected by C# DTO ('FLoorNumber')
      fLoorNumber: Number(formValues.floorNo),

      price: Number(formValues.price),
      status: formValues.status,
      description: formValues.description,
      hotelId: 1
    };

    // const payload: any = {
    //   roomNumber: this.roomForm.value.roomNumber.toString(),
    //   roomTypeId: Number(this.roomForm.value.roomTypesId), // Maps to RoomTypeId
    //   fLoorNumber: Number(this.roomForm.value.floorNo),    // Maps to FLoorNumber (lower camelCase for JSON)
    //   price: Number(this.roomForm.value.price),
    //   status: this.roomForm.value.status,
    //   description: this.roomForm.value.description || '',
    //   hotelId: 1 // Default or selected hotel id if needed
    // };

    if (this.isEditMode) {
      payload.id = this.selectedId;
      this.roomService.update(this.selectedId, payload).subscribe({
        next: () => {
          this.alertService.success('Room Updated Successfully!');
          this.closeModal();
          this.loadRooms();
        },
        error: (err) => {
          console.error(err);
          this.alertService.error('Failed to update room.');
        }
      });
    } else {
      this.roomService.create(payload).subscribe({
        next: () => {
          this.alertService.success('Room Created Successfully!');
          this.closeModal();
          this.loadRooms();
        },
        error: (err) => {
          console.error(err);
          this.alertService.error('Failed to create room.');
        }
      });
    }
  }
  // onSubmit(): void {
  //   if (this.roomForm.invalid) {
  //     return;
  //   }

  //   // Build standard body payload matching the Create/Update API DTO structures exactly
  //   const payload: any = {
  //     roomNumber: this.roomForm.value.roomNumber.toString(),
  //     roomTypesId: Number(this.roomForm.value.roomTypesId),
  //     floorNo: Number(this.roomForm.value.floorNo),
  //     price: Number(this.roomForm.value.price),
  //     status: this.roomForm.value.status,
  //     description: this.roomForm.value.description || '',
  //     hotelId: 1 // Providing standard fallback context matching schema defaults if required
  //   };

  //   if (this.isEditMode) {
  //     payload.id = this.selectedId; // Backend Update needs ID alignment checking validation
  //     this.roomService.update(this.selectedId, payload).subscribe({
  //       next: () => {
  //         this.alertService.success('Room Updated Successfully!');
  //         this.closeModal();
  //         this.loadRooms();
  //       },
  //       error: (err) => {
  //         console.error(err);
  //         this.alertService.error('Failed to update room.');
  //       }
  //     });
  //   } else {
  //     // Do NOT attach an ID parameter for fresh creations
  //     this.roomService.create(payload).subscribe({
  //       next: () => {
  //         this.alertService.success('Room Created Successfully!');
  //         this.closeModal();
  //         this.loadRooms();
  //       },
  //       error: (err) => {
  //         console.error(err);
  //         this.alertService.error('Failed to create room.');
  //       }
  //     });
  //   }
  // }


  onDelete(id: number): void {
    this.alertService.confirm('Are you sure you want to delete this room?', () => {
      this.roomService.delete(id).subscribe({
        next: () => {
          this.alertService.success('Room Deleted Successfully!');
          this.loadRooms();
        },
        error: (err) => {
          console.error(err);
          this.alertService.error('Failed to delete room.');
        }
      });
    });
  }
}