import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { CustomAlertService } from '../../services/custom-alert.service';

interface GuestProfile {
  id?: number; // Add this field to track the guest's unique ID
  roomNo: string;
  title: string;
  guestFirstName: string;
  guestLastName: string;
  mobile: string;
  gender: string;
  age: number | null;
  idType: string;
  idNumber: string;
  uploadedFileName?: string; // <-- ADD THIS FIELD TO TRACK UPLOADS
}

@Component({
  selector: 'app-add-guest',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-guest.component.html',
  styleUrls: ['./add-guest.component.scss']
})
export class AddGuestComponent implements OnInit {
  bookingId: number | null = null;
  bookingDetails: any = null;
  guests: GuestProfile[] = [];

  // Holds individual rooms extracted from the API response array
  availableRooms: string[] = [];

  showAddGuestModal = false;
  isEditMode = false;
  editingIndex: number | null = null;

  guestForm: GuestProfile = {
    roomNo: '',
    title: 'Mr.',
    guestFirstName: '',
    guestLastName: '',
    mobile: '',
    gender: 'Male',
    age: null,
    idType: 'Aadhar Card',
    idNumber: ''
  };

  constructor(
    public readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly bookingService: BookingService,
    private readonly alertService: CustomAlertService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['bookingId']) {
        this.bookingId = +params['bookingId'];
        this.loadLiveBookingData();
      } else {
        this.alertService.error('No valid reservation context was provided.');
      }
    });
  }

 loadLiveBookingData(): void {
  if (!this.bookingId) return;

  this.bookingService.getBookingById(this.bookingId).subscribe({
    next: (res: any) => {
      this.bookingDetails = res;

      // 1. Extract all individual rooms assigned to this booking allocation
      if (res.rooms && Array.isArray(res.rooms)) {
        this.availableRooms = res.rooms
          .map((r: any) => String(r.roomNo || r.roomNumber || '').trim())
          .filter((no: string) => no !== '');
      } else {
        this.availableRooms = [];
      }

      const primaryFullName = `${res.guestFirstName || ''} ${res.guestLastName || ''}`.trim() || 'Unknown Guest';

      // 2. Build our UI rows based on the allocated rooms list, not just database entries!
      if (this.availableRooms.length > 0) {
        
        this.guests = this.availableRooms.map((roomNum, idx) => {
          // Check if the backend database already has a guest assigned to this specific room number
          const existingSavedGuest = res.bookingGuests?.find((g: any) => 
            String(g.roomNo || g.roomNumber || '').trim() === roomNum
          );

          if (existingSavedGuest) {
            // Return the saved guest record from the database
            return {
              id: existingSavedGuest.id,
              roomNo: roomNum,
              title: existingSavedGuest.title || 'Mr.',
              guestFirstName: existingSavedGuest.guestFirstName || existingSavedGuest.firstName || '',
              guestLastName: existingSavedGuest.guestLastName || existingSavedGuest.lastName || '',
              mobile: existingSavedGuest.mobile || existingSavedGuest.billingMobile || res.billingMobile || '',
              gender: existingSavedGuest.gender || 'Male',
              age: existingSavedGuest.age || null,
              idType: existingSavedGuest.idType || 'Aadhar Card',
              idNumber: existingSavedGuest.idNumber || '',
              uploadedFileName: existingSavedGuest.uploadedFileName || existingSavedGuest.uploadedFilename || ''
            };
          } else {
            // Return an empty template row for this room so it stays visible on the UI grid!
            return {
              id: undefined,
              roomNo: roomNum,
              title: 'Mr.',
              guestFirstName: idx === 0 ? (res.guestFirstName || 'Guest') : '',
              guestLastName: idx === 0 ? (res.guestLastName || '') : '',
              mobile: idx === 0 ? (res.billingMobile || '') : '',
              gender: 'Male',
              age: null,
              idType: 'Aadhar Card',
              idNumber: '',
              uploadedFileName: ''
            };
          }
        });

      } else {
        // Fallback for bookings with no explicit room entries assigned yet
        if (res.bookingGuests && res.bookingGuests.length > 0) {
          this.guests = res.bookingGuests.map((g: any) => ({
            id: g.id,
            roomNo: String(g.roomNo || 'Assign'),
            title: g.title || 'Mr.',
            guestFirstName: g.guestFirstName || '',
            guestLastName: g.guestLastName || '',
            mobile: g.mobile || '',
            gender: g.gender || 'Male',
            age: g.age || null,
            idType: g.idType || 'Aadhar Card',
            idNumber: g.idNumber || '',
            uploadedFileName: g.uploadedFileName || ''
          }));
        } else {
          this.guests = [{
            id: undefined,
            roomNo: 'Assign',
            title: 'Mr.',
            guestFirstName: res.guestFirstName || 'Guest',
            guestLastName: res.guestLastName || '',
            mobile: res.billingMobile || '',
            gender: 'Male',
            age: null,
            idType: 'Aadhar Card',
            idNumber: '',
            uploadedFileName: ''
          }];
        }
      }

      if (this.bookingDetails) {
        this.bookingDetails.guestName = primaryFullName;
        this.bookingDetails.mobile = res.billingMobile || '';
      }
    },
    error: (err) => {
      console.error(err);
      this.alertService.error('Failed to parse backend data structure correctly.');
    }
  });
}

deleteGuest(index: number): void {
  const guest = this.guests[index];

  // If the row has an existing database ID, call your backend API or remove it from payload tracking
  if (guest.id && guest.id > 0 && this.bookingId) {
    if (confirm(`Are you sure you want to remove the guest entry from this room allocation?`)) {
      // Filter out this guest from our payload list to push down updates
      const updatedGuestsList = this.guests.filter((_, idx) => idx !== index);
      const payload = updatedGuestsList
        .filter(g => g.id || (g.guestFirstName && g.guestFirstName.trim() !== ''))
        .map(g => ({
          id: g.id || 0,
          roomNo: g.roomNo,
          title: g.title,
          guestFirstName: g.guestFirstName,
          guestLastName: g.guestLastName,
          mobile: g.mobile,
          gender: g.gender,
          age: g.age,
          idType: g.idType,
          idNumber: g.idNumber
        }));

      this.bookingService.updateBookingOccupants(this.bookingId, payload).subscribe({
        next: () => {
          this.alertService.success('Guest removed successfully from data server.');
          this.loadLiveBookingData(); // Reloads tracking to restore clean room views!
        },
        error: (err) => {
          console.error(err);
          this.alertService.error('Failed to update deletions on the data server.');
        }
      });
    }
  } else {
    // If it's a blank placeholder row, clear its fields rather than deleting the room block layout entirely!
    this.guests[index] = {
      id: undefined,
      roomNo: guest.roomNo, // Retain the allocated room layout structural container
      title: 'Mr.',
      guestFirstName: '',
      guestLastName: '',
      mobile: '',
      gender: 'Male',
      age: null,
      idType: 'Aadhar Card',
      idNumber: '',
      uploadedFileName: ''
    };
    this.alertService.success('Local placeholder values cleared.');
  }
}


  openAddGuestModal(): void {
    this.isEditMode = false;
    this.editingIndex = null;
    this.clearForm();

    // Default to the first room item in the list allocation
    if (this.availableRooms.length > 0) {
      this.guestForm.roomNo = this.availableRooms[0];
    }
    this.showAddGuestModal = true;
  }

  editGuest(index: number): void {
    this.isEditMode = true;
    this.editingIndex = index;
    // Deep copy form properties to populate all input text models perfectly on edit
    this.guestForm = {
      roomNo: String(this.guests[index].roomNo || '').trim(),
      title: this.guests[index].title || 'Mr.',
      guestFirstName: this.guests[index].guestFirstName || '',
      guestLastName: this.guests[index].guestLastName || '',
      mobile: this.guests[index].mobile || '',
      gender: this.guests[index].gender || 'Male',
      age: this.guests[index].age || null,
      idType: this.guests[index].idType || 'Aadhar Card',
      idNumber: this.guests[index].idNumber || '',
    };
    this.showAddGuestModal = true;
  }

saveGuestSubmit(): void {
  // Validate ONLY the form row currently being edited/added in the modal
  if (!this.guestForm.guestFirstName.trim() || !this.guestForm.mobile.trim()) {
    this.alertService.error('First name and mobile details are mandatory parameters.');
    return;
  }

  if (!this.bookingId) {
    this.alertService.error('Missing active booking context identifier.');
    return;
  }

  // 1. Merge the modal form changes into the correct index of your local UI array
  if (this.isEditMode && this.editingIndex !== null) {
    this.guests[this.editingIndex] = { ...this.guestForm };
    this.alertService.success('Guest parameters updated successfully.');
  } else {
    this.guests.push({ ...this.guestForm });
    this.alertService.success('Companion profile row added.');
  }

  // 2. CRITICAL FIX: Only send rows that have been saved in the DB (have an ID) 
  //    OR have been filled out by the user (have a first name).
  //    This keeps empty placeholder rows from corrupting the backend payload!
  const validGuests = this.guests.filter(g => 
    (g.id && g.id > 0) || (g.guestFirstName && g.guestFirstName.trim() !== '')
  );

  const payload = validGuests.map(g => ({
    id: g.id || 0, 
    roomNo: g.roomNo,
    title: g.title,
    guestFirstName: g.guestFirstName,
    guestLastName: g.guestLastName,
    mobile: g.mobile,
    gender: g.gender,
    age: g.age,
    idType: g.idType,
    idNumber: g.idNumber
  }));

  console.log('Sending filtered payload to server:', payload);

  // 3. Post to the database endpoint
  this.bookingService.updateBookingOccupants(this.bookingId, payload)
    .subscribe({
      next: (response: any) => {
        this.closeGuestModal();
        this.loadLiveBookingData(); // Safely reloads and keeps empty rooms intact
      },
      error: (err) => {
        console.error(err);
        this.alertService.error('Failed to commit occupant changes to the remote database server.');
      }
    });
}

  closeGuestModal(): void {
    this.showAddGuestModal = false;
    this.clearForm();
  }
  onFileSelected(event: any): void {
  const file: File = event.target.files[0];
  
  if (!file) return;

  if (!this.bookingId) {
    this.alertService.error('Cannot upload document: No active booking context found.');
    return;
  }

  // Pack the parameters into a Multipart Form payload layout
  const formData = new FormData();
  formData.append('file', file);
  formData.append('bookingId', String(this.bookingId));

  // Delegate the API operation to the specialized BookingService instance
  this.bookingService.uploadBookingDocument(formData).subscribe({
    next: (response: any) => {
      this.alertService.success('Identification document archived successfully.');
      // Optional: Refresh local file arrays here if displaying an asset list gallery
    },
    error: (err) => {
      console.error(err);
      this.alertService.error('Failed to commit uploaded file structure to data server.');
    }
  });
}

onRowFileSelected(event: any, guest: GuestProfile, index: number): void {
  const file: File = event.target.files[0];
  if (!file || !this.bookingId) return;

  const formData = new FormData();
  formData.append('file', file);
  console.log('Preparing to upload file for guest:', guest);
    console.log('Preparing to upload file for Me:', String(guest.id));
  formData.append('bookingId', String(this.bookingId));
 // NOW THIS WILL CORRECTLY EXTRACT 1 OR 2 AND APPEND IT AS EXPECTED BY YOUR DTO
  if (guest.id) {
    formData.append('bookingGuestId', String(guest.id)); 
  } else {
    console.warn('Warning: guest.id is missing for row index:', index);
  }
  // These form data markers match the .Contains() lookup criteria used in C# above
  formData.append('guestFirstName', guest.guestFirstName);
  formData.append('roomNo', guest.roomNo);

  this.bookingService.uploadBookingDocument(formData).subscribe({
  next: (response: any) => {
    this.alertService.success(`Document uploaded for ${guest.guestFirstName}`);
    
    // If the backend returns it as lower camel-case, capture it as response.fileName
    this.guests[index].uploadedFileName = response.fileName || response.FileName || file.name;

    if (!this.guests[index].idNumber || this.guests[index].idNumber.trim() === '') {
      this.guests[index].idNumber = 'FILE-ATTACHED'; 
    }
  }
});
}
triggerPrint(): void {
  window.print();
}
navigateToPayment(): void {
  if (this.bookingId) {
    this.router.navigate(['/payment'], { queryParams: { bookingId: this.bookingId } });
  } else {
    this.alertService.error('Cannot navigate to billing: Context identifier is missing.');
  }
}
  clearForm(): void {
    this.guestForm = {
      roomNo: this.availableRooms.length > 0 ? this.availableRooms[0] : '',
      title: 'Mr.',
      guestFirstName: '',
      guestLastName: '',
      mobile: '',
      gender: 'Male',
      age: null,
      idType: 'Aadhar Card',
      idNumber: ''
    };
  }
}