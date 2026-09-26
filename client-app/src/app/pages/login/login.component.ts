import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  error = '';
  loading = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

 submit(): void {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  this.loading = true;
  this.error = '';

  const email = this.form.value.email ?? '';
  const password = this.form.value.password ?? '';

  this.authService.login({
    email,
    password
  }).subscribe({
    next: (response) => {
      this.authService.setActiveHotel(response.activeHotelId ?? null);
      this.router.navigate(['/dashboard']);
    },
    error: (err) => {
      this.error = err?.error?.message ?? 'Unable to login. Please check your credentials.';
      this.loading = false;
    }
  });
}
}