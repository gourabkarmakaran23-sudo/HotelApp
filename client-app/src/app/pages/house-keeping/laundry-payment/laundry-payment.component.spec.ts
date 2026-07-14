import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaundryPaymentComponent } from './laundry-payment.component';

describe('LaundryPaymentComponent', () => {
  let component: LaundryPaymentComponent;
  let fixture: ComponentFixture<LaundryPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaundryPaymentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LaundryPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
