import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HouseKeepingService } from '../../../services/house-keeping.service';
import { CustomAlertService } from '../../../services/custom-alert.service';

@Component({
  selector: 'app-checklist',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checklist.component.html',
  styleUrls: ['../house-keeping-shared.css']
})
export class ChecklistComponent implements OnInit {
  checklistForm!: FormGroup;
  tasks: any[] = [];
  isModalOpen = false;

  constructor(
    private readonly fb: FormBuilder, 
    private readonly hkService: HouseKeepingService,
    private readonly alertService: CustomAlertService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadData();
  }

  initForm(): void {
    this.checklistForm = this.fb.group({
      id: [0],
      taskName: ['', Validators.required],
      type: ['House Keeper', Validators.required]
    });
  }

  loadData(): void {
    this.hkService.getChecklist().subscribe({
      next: (res: any) => {
        if (res && res.$values) {
          this.tasks = res.$values;
        } else if (Array.isArray(res)) {
          this.tasks = res;
        } else {
          this.tasks = [];
        }
      },
      error: (err) => {
        console.error('Error fetching checklist data:', err);
      }
    });
  }

  openModal(data: any = null): void {
    this.isModalOpen = true;
    if (data) {
      this.checklistForm.patchValue({
        id: data.id,
        taskName: data.taskName,
        type: data.type
      });
    } else {
      this.checklistForm.reset({ id: 0, type: 'House Keeper' });
    }
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  saveTask(): void {
    if (this.checklistForm.invalid) {
      this.alertService.warning('Please enter a valid Task Name!');
      return;
    }

    this.hkService.saveChecklist(this.checklistForm.value).subscribe({
      next: (res) => {
        this.alertService.success('Task configuration updated successfully!');
        this.closeModal();
        this.loadData();
      },
      error: (err) => {
        console.error('Save checklist error:', err);
        this.alertService.error('Failed to save task entry.');
      }
    });
  }

  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task from the checklists?')) {
      this.hkService.deleteChecklist(id).subscribe({
        next: (res) => {
          this.alertService.success('Task deleted successfully!');
          this.loadData();
        },
        error: (err) => {
          console.error('Delete checklist error:', err);
          this.alertService.error('Could not complete deletion command.');
        }
      });
    }
  }
}