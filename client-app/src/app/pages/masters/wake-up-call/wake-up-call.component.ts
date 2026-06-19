import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MasterService } from '../../../services/master.service';

@Component({
  selector: 'app-wake-up-call',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './wake-up-call.component.html',
  styleUrls: ['./wake-up-call.component.css']
})
export class WakeUpCallComponent implements OnInit {
  calls: any[] = [];
  selectedCall: any = this.initEmptyModel();
  isEditMode = false;
  isLoading = false;
  errorMessage = '';

  constructor(private masterService: MasterService) {}

  ngOnInit(): void {
    this.loadCalls();
  }

  loadCalls(): void {
    this.isLoading = true;
    this.masterService.getWakeUpCalls().subscribe({
      next: (data) => { 
        this.calls = data; 
        this.isLoading = false; 
      },
      error: () => { 
        this.errorMessage = 'Could not load wake up calls list.'; 
        this.isLoading = false; 
      }
    });
  }

  openEditMode(item: any): void {
    this.isEditMode = true;
    this.selectedCall = { ...item };
    
    // Convert backend timestamp sequence string format cleanly for HTML inputs
    if (this.selectedCall.callDateTime) {
      this.selectedCall.callDateTime = new Date(this.selectedCall.callDateTime).toISOString().slice(0, 16);
    }
  }

  saveCall(): void {
    if (!this.selectedCall.roomNumber || !this.selectedCall.guestName || !this.selectedCall.callDateTime) {
      this.errorMessage = 'Please complete all required fields (*).';
      return;
    }

    this.isLoading = true;
    const execution$ = this.isEditMode
      ? this.masterService.updateWakeUpCall(this.selectedCall.id, this.selectedCall)
      : this.masterService.createWakeUpCall(this.selectedCall);

    execution$.subscribe({
      next: () => { 
        this.resetForm(); 
        this.loadCalls(); 
      },
      error: () => { 
        this.errorMessage = 'Failed to save record modifications.'; 
        this.isLoading = false; 
      }
    });
  }

  deleteCall(id: number): void {
    if (!confirm('Are you sure you want to delete this wake up call entry?')) return;
    this.isLoading = true;
    this.masterService.deleteWakeUpCall(id).subscribe({
      next: () => this.loadCalls(),
      error: () => { 
        this.errorMessage = 'Failed to delete the selected item.'; 
        this.isLoading = false; 
      }
    });
  }

  resetForm(): void {
    this.isEditMode = false;
    this.selectedCall = this.initEmptyModel();
    this.errorMessage = '';
  }

  private initEmptyModel() {
    return { roomNumber: '', guestName: '', callDateTime: '', remarks: '', status: 'Pending' };
  }
}