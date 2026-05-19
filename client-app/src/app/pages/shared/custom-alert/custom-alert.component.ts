import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomAlertService } from '../../../services/custom-alert.service';

/**
 * Shared modal alert component.
 * Drop <app-custom-alert></app-custom-alert> once in AppComponent or any layout shell.
 * It reads from CustomAlertService signal and renders automatically.
 */
@Component({
  selector: 'app-custom-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (alert.state().visible) {
      <div class="alert-overlay" (click)="onOverlayClick($event)">
        <div class="alert-box" [class]="alert.state().type">

          <!-- Icon -->
          <div class="alert-icon">
            @switch (alert.state().type) {
              @case ('success') { <span>✓</span> }
              @case ('error')   { <span>✕</span> }
              @case ('warning') { <span>⚠</span> }
              @default          { <span>ℹ</span> }
            }
          </div>

          <!-- Title -->
          <h3 class="alert-title">{{ alert.state().title }}</h3>

          <!-- Message (supports line breaks) -->
          <p class="alert-message" [innerHTML]="formatted()"></p>

          <!-- OK button -->
          <button class="alert-ok-btn" (click)="alert.close()">OK</button>

        </div>
      </div>
    }
  `,
  styles: [`
    .alert-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      animation: fadeIn .15s ease;
    }

    @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }

    .alert-box {
      background: #fff;
      border-radius: 16px;
      padding: 36px 32px 28px;
      min-width: 340px;
      max-width: 480px;
      width: 90%;
      text-align: center;
      box-shadow: 0 16px 48px rgba(0,0,0,0.22);
      animation: slideUp .2s ease;
      border-top: 5px solid #2d6cdf;
    }

    @keyframes slideUp {
      from { transform: translateY(24px); opacity: 0 }
      to   { transform: translateY(0);    opacity: 1 }
    }

    .alert-box.success { border-top-color: #10b981; }
    .alert-box.error   { border-top-color: #ef4444; }
    .alert-box.warning { border-top-color: #f59e0b; }
    .alert-box.info    { border-top-color: #3b82f6; }

    .alert-icon {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      font-size: 24px;
      font-weight: 900;
    }

    .success .alert-icon { background: #d1fae5; color: #065f46; }
    .error   .alert-icon { background: #fee2e2; color: #991b1b; }
    .warning .alert-icon { background: #fef3c7; color: #92400e; }
    .info    .alert-icon { background: #dbeafe; color: #1e3a8a; }

    .alert-title {
      margin: 0 0 10px;
      font-size: 1.15rem;
      font-weight: 700;
      color: #1b2544;
    }

    .alert-message {
      margin: 0 0 24px;
      font-size: 0.93rem;
      color: #4b5563;
      line-height: 1.6;
      white-space: pre-line;
    }

    .alert-ok-btn {
      padding: 11px 40px;
      border: none;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
      transition: filter .15s;
      color: #fff;
    }

    .success .alert-ok-btn { background: #10b981; }
    .error   .alert-ok-btn { background: #ef4444; }
    .warning .alert-ok-btn { background: #f59e0b; }
    .info    .alert-ok-btn { background: #3b82f6; }

    .alert-ok-btn:hover { filter: brightness(1.1); }
  `]
})
export class CustomAlertComponent {
  alert = inject(CustomAlertService);

  formatted(): string {
    return this.alert.state().message.replace(/\n/g, '<br>');
  }

  onOverlayClick(e: MouseEvent): void {
    // Close only if clicking the backdrop, not the box
    if ((e.target as HTMLElement).classList.contains('alert-overlay')) {
      this.alert.close();
    }
  }
}