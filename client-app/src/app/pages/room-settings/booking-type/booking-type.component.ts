import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MasterService } from '../../../services/master.service';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-booking-type',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-type.component.html',
  styleUrls: ['./booking-type.component.scss']
})
export class BookingTypeComponent implements OnInit {
  collectionList: any[] = [];
  currentModel: any = { id: 0, typeName: '', remarks: '', isActive: true };
  isEditMode = false; isLoading = false;

  constructor(private masterService: MasterService) {}
  ngOnInit(): void { this.loadData(); }

  loadData(): void {
    this.masterService.getBookingTypes().subscribe(res => this.collectionList = res);
  }
  activateEdit(row: any): void {
    this.isEditMode = true;
    this.currentModel = { ...row };
  }
  saveModel(): void {
    if (!this.currentModel.typeName.trim()) return;
    this.isLoading = true;
    // Explicitly type the variable here to merge the union type
  const req$: Observable<any> = this.isEditMode 
    ? this.masterService.updateBookingType(this.currentModel.id, this.currentModel)
    : this.masterService.createBookingType(this.currentModel);

    req$.subscribe({
      next: () => { this.resetForm(); this.loadData(); },
      error: () => this.isLoading = false
    });
  }
  triggerDelete(id: number): void {
    if (!confirm('Delete selected reservation source taxonomy structure?')) return;
    this.masterService.deleteBookingType(id).subscribe(() => this.loadData());
  }
  resetForm(): void {
    this.isEditMode = false; this.isLoading = false;
    this.currentModel = { id: 0, typeName: '', remarks: '', isActive: true };
  }
}