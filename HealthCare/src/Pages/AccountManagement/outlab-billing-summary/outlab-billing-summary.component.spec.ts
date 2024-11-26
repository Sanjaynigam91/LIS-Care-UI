import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutlabBillingSummaryComponent } from './outlab-billing-summary.component';

describe('OutlabBillingSummaryComponent', () => {
  let component: OutlabBillingSummaryComponent;
  let fixture: ComponentFixture<OutlabBillingSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutlabBillingSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutlabBillingSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
