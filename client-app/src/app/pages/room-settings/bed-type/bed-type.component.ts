import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MasterService } from '../../../services/master.service';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-bed-type',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bed-type.component.html',
  styleUrls: ['./bed-type.component.scss']
})
export class BedTypeComponent implements OnInit {
  collectionList: any[] = [];
  currentModel: any = { id: 0, bedName: '', description: '', isActive: true };
  isEditMode = false; isLoading = false;

  constructor(private masterService: MasterService) {}
  ngOnInit(): void { this.loadData(); }

  loadData(): void {
    this.masterService.getBedTypes().subscribe(res => this.collectionList = res);
  }
  activateEdit(row: any): void {
    this.isEditMode = true;
    this.currentModel = { ...row };
  }
  saveModel(): void {
    if (!this.currentModel.bedName.trim()) return;
    this.isLoading = true;
 // Explicitly type the variable here to merge the union type
  const req$: Observable<any> = this.isEditMode 
    ? this.masterService.updateBedType(this.currentModel.id, this.currentModel)
    : this.masterService.createBedType(this.currentModel);

    req$.subscribe({
      next: () => { this.resetForm(); this.loadData(); },
      error: () => this.isLoading = false
    });
  }
  triggerDelete(id: number): void {
    if (!confirm('Purge this bed specification type configuration permanently?')) return;
    this.masterService.deleteBedType(id).subscribe(() => this.loadData());
  }
  resetForm(): void {
    this.isEditMode = false; this.isLoading = false;
    this.currentModel = { id: 0, bedName: '', description: '', isActive: true };
  }
}