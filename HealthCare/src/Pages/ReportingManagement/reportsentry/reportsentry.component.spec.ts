import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsentryComponent } from './reportsentry.component';

describe('ReportsentryComponent', () => {
  let component: ReportsentryComponent;
  let fixture: ComponentFixture<ReportsentryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsentryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportsentryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
