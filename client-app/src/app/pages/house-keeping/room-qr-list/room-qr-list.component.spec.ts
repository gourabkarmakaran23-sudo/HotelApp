import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomQrListComponent } from './room-qr-list.component';

describe('RoomQrListComponent', () => {
  let component: RoomQrListComponent;
  let fixture: ComponentFixture<RoomQrListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomQrListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoomQrListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
