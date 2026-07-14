import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MasterService } from '../../../services/master.service';

@Component({
  selector: 'app-amenities',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './amenity.component.html', // এটি আপডেট করুন
  styleUrls: ['./amenity.component.scss']
})
export class AmenitiesComponent implements OnInit {
  amenities: any[] = [];
  showModal = false;
  isEditMode = false;
  selectedId = 0;
  amenityForm!: FormGroup;

  constructor(private fb: FormBuilder, private masterService: MasterService) {}

  ngOnInit(): void {
    this.amenityForm = this.fb.group({
      amenityName: ['', Validators.required],
      iconClass: ['fa-wifi'],
      description: [''],
      isActive: [true]
    });
    this.loadAmenities();
  }

  loadAmenities() {
    this.masterService.getAmenities().subscribe(res => this.amenities = res);
  }

 save() {
    if (this.amenityForm.invalid) return;

    if (this.isEditMode) {
      this.masterService.updateAmenity(this.selectedId, this.amenityForm.value).subscribe({
        next: () => {
          this.loadAmenities();
          this.showModal = false;
        },
        error: (err) => console.error(err)
      });
    } else {
      this.masterService.createAmenity(this.amenityForm.value).subscribe({
        next: () => {
          this.loadAmenities();
          this.showModal = false;
        },
        error: (err) => console.error(err)
      });
    }
  }
  closeModal()
  {
     this.showModal = false;
  }
  deleteItem(id: number) {
    if(confirm('Delete amenity?')) this.masterService.deleteAmenity(id).subscribe(() => this.loadAmenities());
  }
}