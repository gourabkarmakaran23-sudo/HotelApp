import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export interface HotelLookup {
  id: number;
  name: string;
}

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
    password: ['', [Validators.required, Validators.minLength(6)]],
    hotelId: [null as number | null]
  });

  error = '';
  loading = false;
  availableHotels: HotelLookup[] = [];

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
  const hotelId = this.form.value.hotelId ?? null;

  this.authService.login({
    email,
    password,
    ...(hotelId !== null && { selectedHotelId: hotelId }) // Only send selectedHotelId if selected
  }).subscribe({
    next: (response: any) => {
      // Get hotel ID from API response, fallback to user selection, or default to null
      const activeHotel = response?.activeHotelId ?? hotelId ?? null;
      
      this.authService.setActiveHotel(activeHotel);
      this.router.navigate(['/dashboard']);
    },
    error: (err) => {
      this.error = err?.error?.message ?? 'Unable to login. Please check your credentials.';
      this.loading = false;
    }
  });
}
}