import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MasterService } from '../../../services/master.service';
import { CommissionAgent } from '../../../models/commission-agent.model';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-commission-agent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './commission-agent.component.html',
  styleUrls: ['./commission-agent.component.scss']
})
export class CommissionAgentComponent implements OnInit {
  agents: CommissionAgent[] = [];
  selectedAgent: CommissionAgent = this.initEmptyAgent();
  
  isEditMode = false;
  isFormOpen = false;
  errorMessage = '';
  isLoading = false;

  constructor(private agentService: MasterService) {}

  ngOnInit(): void {
    this.loadAgents();
  }

  loadAgents(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.agentService.getAgents()
      .pipe(
        catchError(error => {
          console.error('Failed to parse commission agents registry:', error);
          this.errorMessage = 'Could not load data from server. Please verify backend state.';
          return of([]);
        })
      )
      .subscribe(data => {
        this.agents = data;
        this.isLoading = false;
      });
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.selectedAgent = this.initEmptyAgent();
    this.isFormOpen = true;
  }

  openEditModal(agent: CommissionAgent): void {
    this.isEditMode = true;
    this.selectedAgent = { ...agent }; 
    this.isFormOpen = true;
  }

  saveAgent(): void {
    // Structural updates applied here to use entity fields
    if (!this.selectedAgent.agentName || this.selectedAgent.commissionRate < 0) {
      this.errorMessage = 'Please complete the form with valid configurations.';
      return;
    }

    this.isLoading = true;
    if (this.isEditMode && this.selectedAgent.id) {
      this.agentService.updateAgent(this.selectedAgent.id, this.selectedAgent).subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err)
      });
    } else {
      this.agentService.createAgent(this.selectedAgent).subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err)
      });
    }
  }

  deleteAgent(id: number | undefined): void {
    if (!id || !confirm('Are you sure you want to remove this agent registry mapping?')) return;

    this.isLoading = true;
    this.agentService.deleteAgent(id).subscribe({
      next: () => this.loadAgents(),
      error: (err) => this.handleError(err)
    });
  }

  closeForm(): void {
    this.isFormOpen = false;
    this.errorMessage = '';
  }

  private initEmptyAgent(): CommissionAgent {
    return { agentName: '', commissionRate: 0, address: '', mobile: '', email: '', gstin: '', isActive: true };
  }

  private handleSuccess(): void {
    this.closeForm();
    this.loadAgents();
  }

  private handleError(err: any): void {
    this.isLoading = false;
    this.errorMessage = err.error?.message || 'An error occurred processing the request data setup.';
    console.error('Registry Error Context:', err);
  }
}