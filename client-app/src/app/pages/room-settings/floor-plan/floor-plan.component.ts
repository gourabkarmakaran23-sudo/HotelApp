import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { MasterService } from '../../../services/master.service';

@Component({
  selector: 'app-floor-plan',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './floor-plan.component.html',
  styleUrls: ['./shared-master-layout.css'] // Links to your global master styles stylesheet
})
export class FloorPlanComponent implements OnInit {
  collectionList: any[] = [];
  currentModel: any = { id: 0, floorName: '', remarks: '', isActive: true };
  isEditMode = false; isLoading = false;

  constructor(private masterService: MasterService) {}
  ngOnInit(): void { this.loadData(); }

  loadData(): void {
    this.masterService.getFloorPlans().subscribe(res => this.collectionList = res);
  }

  activateEdit(row: any): void {
    this.isEditMode = true;
    this.currentModel = { ...row };
  }

  saveModel(): void {
    if (!this.currentModel.floorName || !this.currentModel.floorName.trim()) return;
    this.isLoading = true;

    // Fixed: Explicit type casting prevents the TypeScript method subscription trap
    const request$: Observable<any> = this.isEditMode
      ? this.masterService.updateFloorPlan(this.currentModel.id, this.currentModel)
      : this.masterService.createFloorPlan(this.currentModel);

    request$.subscribe({
      next: () => { this.resetForm(); this.loadData(); },
      error: () => this.isLoading = false
    });
  }

  triggerDelete(id: number): void {
    if (!confirm('Purge this block location layout entry permanently?')) return;
    this.masterService.deleteFloorPlan(id).subscribe(() => this.loadData());
  }

  resetForm(): void {
    this.isEditMode = false; this.isLoading = false;
    this.currentModel = { id: 0, floorName: '', remarks: '', isActive: true }