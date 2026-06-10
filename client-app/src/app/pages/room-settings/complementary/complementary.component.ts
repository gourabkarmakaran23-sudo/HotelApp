import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { MasterService } from '../../../services/master.service';

@Component({
  selector: 'app-complementary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './complementary.component.html',
  styleUrls: ['./shared-master-layout.css'] // Uses your centralized structural stylesheet
})
export class ComplementaryComponent implements OnInit {
  collectionList: any[] = [];
  currentModel: any = { id: 0, itemName: '', description: '', isActive: true };
  isEditMode = false; isLoading = false;

  constructor(private masterService: MasterService) {}
  ngOnInit(): void { this.loadData(); }

  loadData(): void {
    this.masterService.getComplementaries().subscribe(res => this.collectionList = res);
  }

  activateEdit(row: any): void {
    this.isEditMode = true;
    this.currentModel = { ...row };
  }

  saveModel(): void {
    if (!this.currentModel.itemName || !this.currentModel.itemName.trim()) return;
    this.isLoading = true;

    // Fixed: Explicit type casting prevents the TypeScript method subscription trap
    const request$: Observable<any> = this.isEditMode
      ? this.masterService.updateComplementary(this.currentModel.id, this.currentModel)
      : this.masterService.createComplementary(this.currentModel);

    request$.subscribe({
      next: () => { this.resetForm(); this.loadData(); },
      error: () => this.isLoading = false
    });
  }

  triggerDelete(id: number): void {
    if (!confirm('Permanently wipe out this complementary provision feature parameter?')) return;
    this.masterService.deleteComplementary(id).subscribe(() => this.loadData());
  }

  resetForm(): void {
    this.isEditMode = false; this.isLoading = false;
    this.currentModel = { id: 0, itemName: '', description: '', isActive: true };
  }
}