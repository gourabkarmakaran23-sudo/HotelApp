import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MasterService } from '../../../services/master.service';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-booking-source',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-source.component.html',
  styleUrls: ['./booking-source.component.scss']
})
export class BookingSourceComponent implements OnInit {
  collectionList: any[] = [];
  currentModel: any = { id: 0, sourceName: '', details: '', isActive: true };
  isEditMode = false; isLoading = false;

  constructor(private masterService: MasterService) {}
  ngOnInit(): void { this.loadData(); }

  loadData(): void {
    this.masterService.getBookingSources().subscribe(res => this.collectionList = res);
  }
  activateEdit(row: any): void {
    this.isEditMode = true;
    this.currentModel = { ...row };
  }
  saveModel(): void {
    if (!this.currentModel.sourceName.trim()) return;
    this.isLoading = true;
    // Explicitly type the variable here to merge the union type
  const req$: Observable<any> = this.isEditMode 
    ? this.masterService.updateBookingSource(this.currentModel.id, this.currentModel)
    : this.masterService.createBookingSource(this.currentModel);

    req$.subscribe({
      next: () => { this.resetForm(); this.loadData(); },
      error: () => this.isLoading = false
    });

  }
  triggerDelete(id: number): void {
    if (!confirm('Remove this channel pipeline lookup tracker?')) return;
    this.masterService.deleteBookingSource(id).subscribe(() => this.loadData());
  }
  resetForm(): void {
    this.isEditMode = false; this.isLoading = false;
    this.currentModel = { id: 0, sourceName: '', details: '', isActive: true };
  }
}