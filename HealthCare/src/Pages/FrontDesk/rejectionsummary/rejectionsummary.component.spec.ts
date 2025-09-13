import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectionsummaryComponent } from './rejectionsummary.component';

describe('RejectionsummaryComponent', () => {
  let component: RejectionsummaryComponent;
  let fixture: ComponentFixture<RejectionsummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectionsummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectionsummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
