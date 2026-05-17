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

  showAddGuestModal = false;
  newGuest = {
    roomNo: '',
    firstName: '',
    lastName: '',
    mobile: ''
  };

  guests: Array<any> = [
    { roomNo: '304', firstName: 'Mr. Arjun', lastName: 'Roy', mobile: '9999999999' },
    { roomNo: '201', firstName: 'Mr. Karan', lastName: 'Ghosh', mobile: '9999999999' }
  ];

  constructor(public readonly router: Router) {
    const state: any = this.router.getCurrentNavigation()?.extras.state;
    if (state && state.roomNo) {
      this.guest.roomNo = state.roomNo;
      this.newGuest.roomNo = state.roomNo;
    }
  }

  save(): void {
    this.guests.push({
      roomNo: this.guest.roomNo,
      firstName: this.guest.firstName,
      lastName: this.guest.lastName,
      mobile: this.guest.mobile
    });
    this.guest = { roomNo: '', firstName: '', lastName: '', mobile: '' };
    // keep on page; show a toast or alert
    alert('Guest added');
  }

  openAddGuestModal(): void {
    this.newGuest = { roomNo: '', firstName: '', lastName: '', mobile: '' };
    this.showAddGuestModal = true;
  }

  saveNewGuest(): void {
    this.guests.push({
      roomNo: this.newGuest.roomNo,
      firstName: this.newGuest.firstName,
      lastName: this.newGuest.lastName,
      mobile: this.newGuest.mobile
    });
    this.newGuest = { roomNo: '', firstName: '', lastName: '', mobile: '' };
    this.showAddGuestModal = false;
    alert('Guest added successfully');
  }

  cancelNewGuest(): void {
    this.showAddGuestModal = false;
  }

  cancel(): void {
    this.router.navigate(['/checkin']);
  }

  uploadFile(ev: any): void {
    const file = ev.target.files && ev.target.files[0];
    if (file) {
      alert(`Uploaded ${file.name}`);
    }
  }
}
