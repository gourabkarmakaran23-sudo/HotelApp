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
  styleUrls: ['./complementary.component.css'] // Changed from shared placeholder
})
export class ComplementaryComponent implements OnInit {
  collectionList: any[] = [];
  currentModel: any = { id: 0, itemName: '', description: '', isActive: true };
  isEditMode = false; 
  isLoading = false;

  constructor(private masterService: MasterService) {}

  ngOnInit(): void { 
    this.loadData(); 
  }

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

    // Build an audit-compliant payload containing tracking expectations
    const payload = {
      ...this.currentModel,
      isDeleted: false,
      createdAt: this.isEditMode ? this.currentModel.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const request$: Observable<any> = this.isEditMode
      ? this.masterService.updateComplementary(payload.id, payload)
      : this.masterService.createComplementary(payload);

    request$.subscribe({
      next: () => { 
        this.resetForm(); 
        this.loadData(); 
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  triggerDelete(id: number): void {
    if (!confirm('Permanently wipe out this complementary provision feature parameter?')) return;
    this.masterService.deleteComplementary(id).subscribe(() => this.loadData());
  }

  resetForm(): void {
    this.isEditMode = false; 
    this.isLoading = false;
    this.currentModel = { id: 0, itemName: '', description: '', isActive: true };
  }
}