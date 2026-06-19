import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MasterService } from '../../../services/master.service';

@Component({
  selector: 'app-agent-commission',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agent-commission.component.html',
  styleUrls: ['./agent-commission.component.scss'] // Sharing the same styling framework directly!
})
export class AgentCommissionComponent implements OnInit {
  commissions: any[] = [];
  selectedCommission: any = this.initEmptyModel();
  isEditMode = false;
  isFormOpen = false;
  isLoading = false;
  errorMessage = '';

  constructor(private masterService: MasterService) {}

  ngOnInit(): void {
    this.loadCommissions();
  }

  loadCommissions(): void {
    this.isLoading = true;
    this.masterService.getAgentCommissions().subscribe({
      next: (data) => { this.commissions = data; this.isLoading = false; },
      error: (err) => { this.errorMessage = 'Could not retrieve transaction maps.'; this.isLoading = false; }
    });
  }

  calculateAmount(): void {
    // Basic automatic field computation helper
    const targetBaseEstimate = 1000; 
    this.selectedCommission.commissionAmount = (targetBaseEstimate * (this.selectedCommission.commissionPercentage || 0)) / 100;
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.selectedCommission = this.initEmptyModel();
    this.isFormOpen = true;
  }

  openEditModal(item: any): void {
    this.isEditMode = true;
    this.selectedCommission = { ...item };
    if (this.selectedCommission.paidDate) {
      this.selectedCommission.paidDate = this.selectedCommission.paidDate.split('T')[0];
    }
    this.isFormOpen = true;
  }

  saveCommission(): void {
    this.isLoading = true;
    const execution$ = this.isEditMode 
      ? this.masterService.updateAgentCommission(this.selectedCommission.id, this.selectedCommission)
      : this.masterService.createAgentCommission(this.selectedCommission);

    execution$.subscribe({
      next: () => { this.isFormOpen = false; this.loadCommissions(); },
      error: () => { this.errorMessage = 'Failed handling database commit sequence.'; this.isLoading = false; }
    });
  }

  deleteCommission(id: number): void {
    if (!confirm('Are you certain you wish to scratch this payout index item?')) return;
    this.isLoading = true;
    this.masterService.deleteAgentCommission(id).subscribe({
      next: () => this.loadCommissions(),
      error: () => { this.errorMessage = 'Deletion process failure occurred.'; this.isLoading = false; }
    });
  }

  closeForm(): void { this.isFormOpen = false; }
  private initEmptyModel() {
    return { bookingNumber: '', agentName: '', commissionPercentage: 0, commissionAmount: 0, paymentStatus: 'Due', paidDate: null };
  }
}