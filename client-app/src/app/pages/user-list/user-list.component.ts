import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserListItem } from '../../services/user-repository.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="user-list-page">
      <header class="page-header">
        <div>
          <h1>User List</h1>
          <p>View accounts, assigned properties, and access status.</p>
        </div>
        <a class="create-user" routerLink="/admin/users/create">Create user</a>
      </header>

      <p class="state" *ngIf="loading">Loading users...</p>
      <p class="state error" *ngIf="error">{{ error }}</p>

      <div class="table-wrap" *ngIf="!loading && !error && users.length">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Company</th>
              <th>Hotel</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users">
              <td>{{ user.fullName }}</td>
              <td>{{ user.userName }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.role }}</td>
              <td>{{ user.companyName || '—' }}</td>
              <td>{{ user.hotelName || '—' }}</td>
              <td><span [class.inactive]="!user.isActive">{{ user.isActive ? 'Active' : 'Inactive' }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="state" *ngIf="!loading && !error && users.length === 0">No user accounts found.</p>
    </section>
  `,
  styles: [`
    .user-list-page { min-width: 0; background: #fff; border: 1px solid #e1e5eb; border-radius: 8px; padding: 20px; color: #182335; }
    .page-header { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding-bottom: 16px; border-bottom: 1px solid #e1e5eb; }
    h1 { margin: 0; font-size: 22px; }
    .page-header p { margin: 6px 0 0; color: #687387; }
    .create-user { padding: 9px 16px; border-radius: 4px; background: #246b45; color: #fff; font-weight: 600; text-decoration: none; white-space: nowrap; }
    .state { margin: 18px 0 0; color: #58657a; }
    .error { color: #a12622; }
    .table-wrap { overflow-x: auto; }
    table { width: 100%; margin-top: 16px; border-collapse: collapse; text-align: left; }
    th, td { padding: 11px 12px; border-bottom: 1px solid #e8ebf0; white-space: nowrap; }
    th { color: #596579; font-size: 12px; font-weight: 700; }
    td { color: #263246; font-size: 13px; }
    .inactive { color: #a12622; }
    @media (max-width: 640px) { .page-header { align-items: flex-start; flex-direction: column; } }
  `]
})
export class UserListComponent implements OnInit {
  users: UserListItem[] = [];
  loading = true;
  error = '';

  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getUsers().subscribe({
      next: users => {
        this.users = users;
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load users.';
        this.loading = false;
      }
    });
  }
}