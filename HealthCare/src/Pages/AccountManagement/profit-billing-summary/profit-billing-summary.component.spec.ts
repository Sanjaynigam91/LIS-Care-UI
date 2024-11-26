import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfitBillingSummaryComponent } from './profit-billing-summary.component';

describe('ProfitBillingSummaryComponent', () => {
  let component: ProfitBillingSummaryComponent;
  let fixture: ComponentFixture<ProfitBillingSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfitBillingSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfitBillingSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
