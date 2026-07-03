import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignRoomCleaningComponent } from './assign-room-cleaning.component';

describe('AssignRoomCleaningComponent', () => {
  let component: AssignRoomCleaningComponent;
  let fixture: ComponentFixture<AssignRoomCleaningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignRoomCleaningComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssignRoomCleaningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
