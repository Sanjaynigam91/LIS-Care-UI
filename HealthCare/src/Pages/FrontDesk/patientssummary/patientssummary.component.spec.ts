import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientssummaryComponent } from './patientssummary.component';

describe('PatientssummaryComponent', () => {
  let component: PatientssummaryComponent;
  let fixture: ComponentFixture<PatientssummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientssummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientssummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
