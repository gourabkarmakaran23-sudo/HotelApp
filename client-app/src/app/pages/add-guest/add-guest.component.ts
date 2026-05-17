import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-guest',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-guest.component.html',
  styleUrls: ['./add-guest.component.scss']
})
export class AddGuestComponent {
  guest = {
    roomNo: '',
    firstName: '',
    lastName: '',
    mobile: ''
  };

  constructor(private readonly router: Router) {
    const state: any = this.router.getCurrentNavigation()?.extras.state;
    if (state && state.roomNo) {
      this.guest.roomNo = state.roomNo;
    }
  }

  save(): void {
    alert(`Guest added: ${this.guest.firstName} ${this.guest.lastName} (Room ${this.guest.roomNo})`);
    this.router.navigate(['/checkin']);
  }

  cancel(): void {
    this.router.navigate(['/checkin']);
  }
}
