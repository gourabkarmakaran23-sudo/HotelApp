import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoomService, Room } from '../../services/room.service';
import { CustomAlertService } from '../../services/custom-alert.service';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  allRooms: Room[] = [];
  filteredRooms: Room[] = [];
  searchQuery: string = '';

  // Modal Control States
  isModalOpen: boolean = false;
  isEditMode: boolean = false;
  isSaving: boolean = false;

  // Active operational record tracking schema
  activeRoomModel: Room = this.initBlankFormObject();

  constructor(
    private readonly roomService: RoomService,
    private readonly alertService: CustomAlertService
  ) {}

  ngOnInit(): void {
    this.loadRoomsList();
  }

  loadRoomsList(): void {
    this.roomService.getAll().subscribe({
    //   next: (data) => {
    //     this.allRooms = data;
    //     this.applyFilteringEngine();
    //   },
    next: (response: any) => {
  this.allRooms = response.items || [];
  this.applyFilteringEngine();
},
      error: (err) => {
        console.error(err);
        this.alertService.error('Failed to load hotel room inventory records from backend environment context.');
      }
    });
  }

  applyFilteringEngine(): void {
    if (!this.searchQuery.trim()) {
      this.filteredRooms = [...this.allRooms];
    } else {
      const query = this.searchQuery.toLowerCase().trim();
      this.filteredRooms = this.allRooms.filter(r => 
        r.roomNumber.toLowerCase().includes(query) || 
        r.roomType.toLowerCase().includes(query)
      );
    }
  }

  onSearch(): void {
    this.applyFilteringEngine();
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.activeRoomModel = this.initBlankFormObject();
    this.isModalOpen = true;
  }

  openEditModal(room: Room): void {
    this.isEditMode = true;
    // Deep copy object to insulate direct layout visual mutabilities prior api completion verification
    this.activeRoomModel = JSON.parse(JSON.stringify(room));
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.isEditMode = false;
    this.isSaving = false;
  }

  onSaveRoom(): void {
    // Form verification safeguards check
    if (!this.activeRoomModel.roomNumber || !this.activeRoomModel.roomType || !this.activeRoomModel.capacity || !this.activeRoomModel.price || !this.activeRoomModel.status) {
      this.alertService.warning('Please complete all mandatory dataset markers denoted with an asterisk (*).');
      return;
    }

    this.isSaving = true;

    if (this.isEditMode) {
      // Direct Web API Put Binding Call Route Execution
      this.roomService.update(this.activeRoomModel.id, this.activeRoomModel).subscribe({
        next: () => {
          this.isSaving = false;
          this.alertService.success(`Configuration room tracking identifier ${this.activeRoomModel.roomNumber} updated successfully.`);
          this.closeModal();
          this.loadRoomsList();
        },
        error: (err) => {
          this.isSaving = false;
          console.error(err);
          this.alertService.error('Error processing configuration save request update array pipeline block context.');
        }
      });
    } else {
      // Direct Web API Post Mapping Insertion Route Execution
      this.roomService.create(this.activeRoomModel).subscribe({
        next: () => {
          this.isSaving = false;
          this.alertService.success(`New Room Entity Entry record ${this.activeRoomModel.roomNumber} successfully generated.`);
          this.closeModal();
          this.loadRoomsList();
        },
        error: (err) => {
          this.isSaving = false;
          console.error(err);
          this.alertService.error('An error context structure mapping breakdown occurred during creation request protocol handling blocks.');
        }
      });
    }
  }

  getRoomTypeLabel(type: string | number): string {
    // Map string values from payload structure representation cleanly 
    return type === 'Standard' || type === 0 ? 'Standard Base' :
           type === 'Deluxe' || type === 1 ? 'Deluxe Luxury' :
           type === 'Suite' || type === 2 ? 'Executive Suite' : String(type);
  }

  private initBlankFormObject(): Room {
    return {
      id: 0,
      roomNumber: '',
      roomType: '',
      capacity: 2,
      price: 120,
      status: 'Available',
      description: '',
      hotelId: 1 // Default system instance tracking fallback map payload initialization setup definition
    };
  }
}