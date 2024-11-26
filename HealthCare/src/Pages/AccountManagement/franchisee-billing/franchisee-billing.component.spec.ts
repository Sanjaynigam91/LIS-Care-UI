import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FranchiseeBillingComponent } from './franchisee-billing.component';

describe('FranchiseeBillingComponent', () => {
  let component: FranchiseeBillingComponent;
  let fixture: ComponentFixture<FranchiseeBillingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FranchiseeBillingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FranchiseeBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
