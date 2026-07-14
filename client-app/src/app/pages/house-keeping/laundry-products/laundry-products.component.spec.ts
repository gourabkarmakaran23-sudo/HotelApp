import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaundryProductsComponent } from './laundry-products.component';

describe('LaundryProductsComponent', () => {
  let component: LaundryProductsComponent;
  let fixture: ComponentFixture<LaundryProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaundryProductsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LaundryProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
