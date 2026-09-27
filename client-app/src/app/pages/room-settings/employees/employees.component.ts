import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { EmployeePayload, EmployeeRecord, MasterService } from '../../../services/master.service';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {
  employees: EmployeeRecord[] = [];
  isEditMode = false;
  isLoading = false;
  isSaving = false;
  errorMessage = '';

  readonly roles = [
    { value: 'FrontDesk', label: 'Front Desk' },
    { value: 'Housekeeping', label: 'Housekeeping' },
    { value: 'Manager', label: 'Manager' },
    { value: 'Chef', label: 'Chef' },
    { value: 'Waiter', label: 'Waiter' },
    { value: 'Bartender', label: 'Bartender' },
    { value: 'Accountant', label: 'Accountant' },
    { value: 'Maintenance', label: 'Maintenance' }
  ];

  form: EmployeePayload = this.emptyForm();

  constructor(private readonly masterService: MasterService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.masterService.getEmployees().subscribe({
      next: employees => {
        this.employees = employees || [];
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load employees for this hotel.';
        this.isLoading = false;
      }
    });
  }

  edit(employee: EmployeeRecord): void {
    this.isEditMode = true;
    this.editingId = employee.id;
    this.form = {
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email || '',
      phone: employee.phone || '',
      role: employee.role,
      hireDate: employee.hireDate.slice(0, 10),
      salary: employee.salary
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  save(): void {
    if (this.isSaving) return;
    this.isSaving = true;
    this.errorMessage = '';
    const payload = { ...this.form };
    const request: Observable<unknown> = this.isEditMode && this.editingId !== null
      ? this.masterService.updateEmployee(this.editingId, payload)
      : this.masterService.createEmployee(payload);

    request.subscribe({
      next: () => {
        this.resetForm();
        this.loadEmployees();
        this.isSaving = false;
      },
      error: () => {
        this.errorMessage = 'Unable to save this employee. Check the details and try again.';
        this.isSaving = false;
      }
    });
  }

  remove(employee: EmployeeRecord): void {
    if (!window.confirm(`Remove ${employee.firstName} ${employee.lastName} from this hotel?`)) return;
    this.masterService.deleteEmployee(employee.id).subscribe({
      next: () => this.loadEmployees(),
      error: () => this.errorMessage = 'Unable to remove this employee.'
    });
  }

  resetForm(): void {
    this.isEditMode = false;
    this.editingId = null;
    this.form = this.emptyForm();
  }

  roleName(value: string): string {
    return this.roles.find(role => role.value === value)?.label ?? 'Unknown';
  }

  private editingId: number | null = null;

  private emptyForm(): EmployeePayload {
    return {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'FrontDesk',
      hireDate: new Date().toISOString().slice(0, 10),
      salary: 0
    };
  }
}