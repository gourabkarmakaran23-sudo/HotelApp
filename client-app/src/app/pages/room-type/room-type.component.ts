import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RoomTypeService } from '../../services/room-type.service';
import { RoomTypeDto, CreateRoomTypeDto } from '../../models/room-type.model';
import { CustomAlertService } from '../../services/custom-alert.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-room-type',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // Notice HttpClientModule is no longer needed here if provided globally
  templateUrl: './room-type.component.html',
  styleUrls: ['./room-type.component.scss']
})
export class RoomTypeComponent implements OnInit {
  roomTypes: RoomTypeDto[] = [];
filteredRoomTypes: RoomTypeDto[] = [];
isModalOpen = false;

isEditMode = false;
selectedId = 0;

roomTypeForm!: FormGroup;
  // ⬇️ Injected our custom RoomTypeService here
  constructor(private fb: FormBuilder, private roomTypeService: RoomTypeService, private alertService: CustomAlertService, private router: Router) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadRoomTypes();
  }

  initForm(): void {
    this.roomTypeForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      basePrice: [0, [Validators.required, Validators.min(0)]],
      maxOccupancy: [1, [Validators.required, Validators.min(1)]],
      maxAdults: [1, [Validators.required, Validators.min(1)]],
      maxChildren: [0, [Validators.required, Validators.min(0)]],
      imageUrl: [''],
      isActive: [true]
    });
  }

  loadRoomTypes(): void {
    // ⬇️ Clean abstraction: using the service to gather the data array
    this.roomTypeService.getAll().subscribe({
      next: (res) => {
        if (res.success || res.data) {
          this.roomTypes = res.data || (res as any);
          this.filteredRoomTypes = [...this.roomTypes];
        }
      },
      error: (err) => console.error('Failed to load room types via service', err)
    });
  }

  onSearch(event: Event): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase().trim();
    if (!query) {
      this.filteredRoomTypes = [...this.roomTypes];
    } else {
      this.filteredRoomTypes = this.roomTypes.filter(rt => 
        rt.name.toLowerCase().includes(query)
      );
    }
  }

openAddModal(): void {

  this.isEditMode = false;

  this.selectedId = 0;

  this.roomTypeForm.reset({
    basePrice: 0,
    maxOccupancy: 1,
    maxAdults: 1,
    maxChildren: 0,
    isActive: true
  });

  this.isModalOpen = true;
}
  closeModal(): void {
    this.isModalOpen = false;
  }

  openEditModal(room: RoomTypeDto): void {

  this.isEditMode = true;

  this.selectedId = room.id;

  this.roomTypeForm.patchValue({
    name: room.name,
    description: room.description,
    basePrice: room.basePrice,
    maxOccupancy: room.maxOccupancy,
    maxAdults: room.maxAdults,
    maxChildren: room.maxChildren,
    imageUrl: room.imageUrl,
    isActive: room.isActive
  });

  this.isModalOpen = true;
}
  onSubmit(): void {
    if (this.roomTypeForm.invalid) {
      this.roomTypeForm.markAllAsTouched();
      return;
    }

    // const payload: CreateRoomTypeDto = this.roomTypeForm.value;

    const formValue = this.roomTypeForm.value;

  // Manually construct the payload to see exactly what is being dispatched
  const payload: CreateRoomTypeDto = {
    name: formValue.name,
    description: formValue.description || '',
    basePrice: Number(formValue.basePrice),      // Enforce clean numbers
    maxOccupancy: Number(formValue.maxOccupancy),// Enforce clean numbers
    maxAdults: Number(formValue.maxAdults),      // Enforce clean numbers
    maxChildren: Number(formValue.maxChildren),  // Enforce clean numbers
    imageUrl: formValue.imageUrl || '',
    isActive: Boolean(formValue.isActive)        // Enforce explicit boolean
  };

  console.log('Sending Payload:', payload); // Look at this in your console!
    // ⬇️ Routing payload data seamlessly through the service layer
  if (this.isEditMode) {

  this.roomTypeService.update(this.selectedId, payload)
    .subscribe({

      next: () => {

        this.alertService.success(
          'Room Type Updated Successfully!'
        );

        this.closeModal();

        this.loadRoomTypes();
      },

      error: (err) => {

        console.error(err);

        this.alertService.error(
          'Failed to update room type.'
        );
      }
    });

} else {

  this.roomTypeService.create(payload)
    .subscribe({

      next: () => {

        this.alertService.success(
          'Room Type Created Successfully!'
        );

        this.closeModal();

        this.loadRoomTypes();
      },

      error: (err) => {

        console.error(err);

        this.alertService.error(
          'Failed to create room type.'
        );
      }
    });
}
  }

  onDelete(id: number): void {

  this.alertService.confirm(

    'Are you sure you want to delete this room type?',

    () => {

      this.roomTypeService.delete(id).subscribe({

        next: () => {

          this.alertService.success(
            'Room Type Deleted Successfully!'
          );

          this.loadRoomTypes();
        },

        error: (err) => {

          console.error(err);

          this.alertService.error(
            'Failed to delete room type.'
          );
        }
      });
    },

    () => {
      console.log('Delete cancelled');
    }
  );
}
}