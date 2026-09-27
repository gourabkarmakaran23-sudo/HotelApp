import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Room, RoomService } from '../../services/room.service';
import { RoomTypeService } from '../../services/room-type.service';
import { CustomAlertService } from '../../services/custom-alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  rooms: any[] = [];
  filteredRooms: any[] = []; 
  roomTypesList: any[] = [];
  isModalOpen = false;
  isEditMode = false;
  selectedId = 0;
  roomForm!: FormGroup;
  allRooms: any[] = [];          

  searchQuery: string = '';
  currentPage = 1;
  pageSize = 10;
  //status: 0;
statusOptions = [
  { label: 'Available', value: 1 },
  { label: 'Occupied', value: 2 },
  { label: 'Maintenance', value: 3 },
  { label: 'Reserved', value: 4 },
  { label: 'Out Of Service', value: 5 },
  { label: 'Cleaning', value: 6 }
];

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
  }

  initForm(): void {
    this.roomForm = this.fb.group({
      roomNumber: ['', Validators.required],
      roomTypesId: [null, Validators.required],
      floorNumber: ['', [Validators.required, Validators.min(0)]],
      price: ['', [Validators.required, Validators.min(0)]],
      status: [0, Validators.required] ,// Changes 'Available' to null by default
      description: ['']
    });
  }

  loadRoomTypes(): void {
    this.roomTypeService.getAll().subscribe({
      next: (res: any) => {
        if (Array.isArray(res)) {
          this.roomTypesList = res;
        } else if (res && Array.isArray(res.data)) {
          this.roomTypesList = res.data; 
        } else if (res && Array.isArray(res.items)) {
          this.roomTypesList = res.items;
        } else if (res && res.$values) {
          this.roomTypesList = res.$values;
        } else {
          this.roomTypesList = [];
        }
        this.loadRoomsList();
      },
      error: (err) => {
        console.error('Failed to load room types:', err);
      }
    });
  }

  loadRoomsList(): void {
    this.roomService.getAll(1, 50, this.searchQuery).subscribe({
      next: (response: any) => { 
        this.allRooms = response.items || [];
        console.log('Fetched Rooms:', this.allRooms);
        this.applyFilteringEngine();
      },
      error: (err) => {
        console.error(err);
        this.alertService.error('Failed to load rooms.');
      }
    });
  }

  applyFilteringEngine(): void {
    if (!this.allRooms || !this.roomTypesList) return;

    this.allRooms.forEach(room => {
      const match = this.roomTypesList.find(t => t.id === Number(room.roomTypesId));
      room.roomTypeName = match ? match.name : 'Unknown';
    });

    this.filteredRooms = [...this.allRooms];
    this.applySearchFilter();
  }

  onSearch(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.currentPage = 1;
    this.applySearchFilter();
  }

  private applySearchFilter(): void {
    const query = this.searchQuery;
    this.filteredRooms = this.allRooms.filter(room =>
      [room.roomNumber, room.roomTypeName, room.floorNo, room.price, room.status]
        .some(value => String(value ?? '').toLowerCase().includes(query))
    );
  }

  get pagedRooms(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredRooms.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredRooms.length / this.pageSize));
  }

  get firstVisibleRow(): number {
    return this.filteredRooms.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get lastVisibleRow(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredRooms.length);
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.selectedId = 0;
    this.roomForm.reset({
      roomNumber: '',
      roomTypesId: null,
      floorNumber: '',
      price: '',
      status: null, // Changes 'Available' to null by default
      description: ''
    });
    this.isModalOpen = true;
  }

  // openEditModal(room: any): void {
  //   console.log('Editing Room:', room);
  //   this.isEditMode = true;
  //   this.selectedId = room.id;
  //   this.roomForm.patchValue({
  // roomNumber: room.roomNumber,
  // roomTypesId: room.roomTypesId,
  // floorNumber: room.floorNumber || room.floorNumber,
  // price: room.price,
  
  // // FIX: If status is numeric 0 or missing, force it to 'null' so the placeholder matches!
  // status: (room.status === 0 || room.status === '0') ? null : room.status,
  
  // description: room.description
  // });
  //   this.isModalOpen = true;
  // }

//   openEditModal(selectedRoom: any): void {

//   this.selectedId = selectedRoom.id || selectedRoom.Id;
//   this.isEditMode = true;
//   this.isModalOpen = true;
//   console.log('Editing Room:', selectedRoom);
//   const rawStatus = selectedRoom.status || selectedRoom.Status;

//   // Safeguard: If status value is 0, '0', or invalid, turn it into null 
//   // so the dropdown matches your "-- Select Status --" placeholder option!
//   let correctStatusValue: string | null = null;
//   if (rawStatus === 'Available' || rawStatus === 'Occupied' || rawStatus === 'Maintenance') {
//     correctStatusValue = rawStatus;
//   } else {
//     correctStatusValue = null; 
//   }

//   this.roomForm.patchValue({
//     roomNumber: selectedRoom.roomNumber || selectedRoom.RoomNumber,
//     roomTypesId: selectedRoom.roomTypesId || selectedRoom.RoomTypesId,
//     floorNumber: selectedRoom.floorNo || selectedRoom.floorNo || selectedRoom.floorNo,
//     price: selectedRoom.price || selectedRoom.Price,
//     status: correctStatusValue, // Enforces dropdown correctness
//     description: selectedRoom.description || selectedRoom.Description
//   });
// }


openEditModal(selectedRoom: any): void {

  this.selectedId = selectedRoom.id || selectedRoom.Id;

  this.isEditMode = true;
  this.isModalOpen = true;

  console.log('Editing Room:', selectedRoom);

  // Convert status properly
  let correctStatusValue: number | null = null;

  const rawStatus = selectedRoom.status ?? selectedRoom.Status;

  // If API returns number
  if (typeof rawStatus === 'number') {
    correctStatusValue = rawStatus;
  }

  // If API returns string
  else if (typeof rawStatus === 'string') {

    switch (rawStatus.toLowerCase()) {

      case 'available':
        correctStatusValue = 0;
        break;

      case 'occupied':
        correctStatusValue = 1;
        break;

      case 'maintenance':
        correctStatusValue = 2;
        break;

      case 'outofservice':
        correctStatusValue = 3;
        break;

      case 'cleaning':
        correctStatusValue = 4;
        break;
      case 'reserved':
        correctStatusValue = 5;
        break;


      default:
        correctStatusValue = null;
        break;
    }
  }

  this.roomForm.patchValue({
    roomNumber: selectedRoom.roomNumber || selectedRoom.RoomNumber,

    roomTypesId:
      selectedRoom.roomTypesId || selectedRoom.RoomTypesId,

    floorNumber:
      selectedRoom.floorNo ||
      selectedRoom.FloorNo ||
      selectedRoom.floorNumber,

    price: selectedRoom.price || selectedRoom.Price,

    status: correctStatusValue,

    description:
      selectedRoom.description || selectedRoom.Description
  });
}


  closeModal(): void {
    this.isModalOpen = false;
  }


onSubmit(): void {
  if (this.roomForm.invalid) return;

  const formValues = this.roomForm.value;

  const payload: any = {
  roomNumber: formValues.roomNumber,
  roomTypesId: Number(formValues.roomTypesId),
  floorNo: Number(formValues.floorNumber), // Double-check if your DTO has FloorNo or FloorNumber now
  price: Number(formValues.price),
  status: formValues.status,               
  description: formValues.description || '',
  hotelId: 1 
};
console.log('Submitting Room Payload:', payload);
  if (this.isEditMode) {
    // FIX: Change 'id' to capital 'Id' so it maps seamlessly to UpdateRoomDto.Id
  payload.Id = this.selectedId;
    
    this.roomService.update(this.selectedId, payload).subscribe({
      next: () => {
        this.alertService.success('Room Updated Successfully!');
        this.closeModal();
        this.loadRoomsList(); 
      },
      error: (err) => {
        this.alertService.error(JSON.stringify(err.error));
      }
    });
  } else {
    this.roomService.create(payload).subscribe({
      next: () => {
        this.alertService.success('Room Created Successfully!');
        this.closeModal();
        this.loadRoomsList(); 
      },
      error: (err) => {
        this.alertService.error('Failed to create room.');
      }
    });
  }
}


  onDelete(id: number): void {
    this.alertService.confirm('Are you sure you want to delete this room?', () => {
      this.roomService.delete(id).subscribe({
        next: () => {
          this.alertService.success('Room Deleted Successfully!');
          this.loadRoomsList(); 
        },
        error: (err) => {
          console.error(err);
          this.alertService.error('Failed to delete room.');
        }
      });
    });
  }
}