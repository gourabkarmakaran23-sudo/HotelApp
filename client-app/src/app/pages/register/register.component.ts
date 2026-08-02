import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HotelLookupDto, HotelService } from '../../services/hotel.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form = this.fb.group({
    userName: ['', [Validators.required, Validators.minLength(3)]],
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
    role: ['User', [Validators.required]],
    hotelId: [null as number | null]
  });

  error = '';
  loading = false;
  availableHotels: HotelLookupDto[] = [];
  roleOptions = ['SuperAdmin', 'Admin', 'User'];

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly hotelService: HotelService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.hotelService.getLookup().subscribe({
      next: (hotels) => this.availableHotels = hotels,
      error: () => this.availableHotels = []
    });
  }

  submit(): void {
    if (this.form.invalid || this.passwordsDoNotMatch()) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';

    const userName = (this.form.value.userName ?? '').trim();
    const fullName = (this.form.value.fullName ?? '').trim();
    const email = (this.form.value.email ?? '').trim();
    const password = this.form.value.password ?? '';
    const confirmPassword = this.form.value.confirmPassword ?? '';
    const role = this.form.value.role ?? 'User';
    const hotelId = this.form.value.hotelId ?? null;

    this.authService.register({
      userName: userName || email.split('@')[0],
      fullName,
      email,
      password,
      confirmPassword,
      role,
      hotelId
    }).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => {
        this.error = err?.error?.message ?? 'Unable to register. Please try again.';
        this.loading = false;
      }
    });
  }

  passwordsDoNotMatch(): boolean {
    return this.form.value.password !== this.form.value.confirmPassword;
  }
}
