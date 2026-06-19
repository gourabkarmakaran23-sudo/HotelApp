import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Room, RoomService } from '../../services/room.service';
import { RoomTypeService } from '../../services/room-type.service';
import { CustomAlertService } from '../../services/custom-alert.service';
import { Router } from '@angular/router';

// 1. Import AG-Grid Angular component
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridReadyEvent, GridApi } from 'ag-grid-community';

@Component({
  selector: 'app-room',
  standalone: true,
  // 2. Add AgGridAngular to your component imports
  imports: [CommonModule, ReactiveFormsModule, AgGridAngular],
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
  //status: 0;
statusOptions = [
  { label: 'Available', value: 1 },
  { label: 'Occupied', value: 2 },
  { label: 'Maintenance', value: 3 },
  { label: 'Reserved', value: 4 },
  { label: 'Out Of Service', value: 5 },
  { label: 'Cleaning', value: 6 }
];

  // AG-Grid Reference API
  private gridApi!: GridApi;

  // 3. Define AG-Grid Column Schema Configurations
  public columnDefs: ColDef[] = [
    { 
      field: 'roomNumber', 
      headerName: 'Room Number', 
      sortable: true, 
      filter: true,
      cellStyle: { fontWeight: 'bold' }
    },
    { 
      field: 'roomTypeName', 
      headerName: 'Room Type', 
      sortable: true, 
      filter: true 
    },
    { 
      field: 'floorNo', 
      headerName: 'Floor No', 
      sortable: true, 
      filter: 'agNumberColumnFilter' 
    },
    { 
      field: 'price', 
      headerName: 'Price', 
      sortable: true, 
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) => {
        if (params.value == null) return '';
        return '₹' + Number(params.value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      sortable: true, 
      filter: true,
      cellRenderer: (params: any) => {
        if (!params.value) return '';
        const isAvailable = params.value === 'Available';
        const badgeClass = isAvailable ? 'active' : 'inactive';
        return `<span class="status-badge ${badgeClass}">${params.value}</span>`;
      }
    },
    {
      headerName: 'Actions',
      field: 'id',
      sortable: false,
      filter: false,
      minWidth: 200,
      cellClass: 'actions-cell',
      cellRenderer: (params: any) => {
        // We inject data-attributes so we can capture clicks globally
        return `
          <button class="action-btn edit-btn" data-action="edit" data-id="${params.value}">
            <i class="fas fa-edit"></i> Edit
          </button>
          <button class="action-btn delete-btn" data-action="delete" data-id="${params.value}">
            <i class="fas fa-trash"></i> Delete
          </button>
        `;
      }
    }
  ];

  // Default Column settings applied across all columns
  public defaultColDef: ColDef = {
    flex: 1,
    minWidth: 120,
    resizable: true,
  };

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

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
  }

  // Handle row template button clicks inside AG-Grid cells
  // onCellClicked(event: any): void {
  //   const target = event.event.target as HTMLElement;
  //   const actionButton = target.closest('.action-btn');
    
  //   if (!actionButton) return;

  //   const action = actionButton.getAttribute('data-action');
  //   const roomId = Number(actionButton.getAttribute('data-id'));
  //   const matchedRoom = this.filteredRooms.find(r => r.id === roomId);

  //   if (action === 'edit' && matchedRoom) {
  //     this.openEditModal(matchedRoom);
  //   } else if (action === 'delete') {
  //     this.onDelete(roomId);
  //   }
  // }

  // Handle row template button clicks inside AG-Grid cells
onCellClicked(event: any): void {
  const target = event.event.target as HTMLElement;
  const actionButton = target.closest('.action-btn');
  
  if (!actionButton) return;

  const action = actionButton.getAttribute('data-action');
  const roomId = Number(actionButton.getAttribute('data-id'));
  
  // SAFE LOOKUP: Checks both 'id' and 'Id' variations coming from your list records
  const matchedRoom = this.filteredRooms.find(r => (r.id === roomId || r.Id === roomId));
  console.log('Clicked Action:', action, 'on Room ID:', roomId, 'Matched Room:', matchedRoom);
  if (action === 'edit' && matchedRoom) {
    this.openEditModal(matchedRoom);
  } else if (action === 'delete') {
    this.onDelete(roomId);
  }
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
    
    // Explicitly update grid state if api initialized
    if (this.gridApi) {
      this.gridApi.setGridOption('rowData', this.filteredRooms);
    }
  }

  onSearch(event: any): void {
    const value = event.target.value;
    // Utilize AG-Grid's ultra-fast built-in global filter engine
    if (this.gridApi) {
      this.gridApi.setGridOption('quickFilterText', value);
    }
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