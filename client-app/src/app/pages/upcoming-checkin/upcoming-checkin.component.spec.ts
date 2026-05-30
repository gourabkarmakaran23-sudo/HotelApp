import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingCheckinComponent } from './upcoming-checkin.component';

describe('UpcomingCheckinComponent', () => {
  let component: UpcomingCheckinComponent;
  let fixture: ComponentFixture<UpcomingCheckinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpcomingCheckinComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpcomingCheckinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
