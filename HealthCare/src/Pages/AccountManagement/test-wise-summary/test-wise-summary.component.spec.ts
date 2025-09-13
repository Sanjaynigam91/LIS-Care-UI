import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestWiseSummaryComponent } from './test-wise-summary.component';

describe('TestWiseSummaryComponent', () => {
  let component: TestWiseSummaryComponent;
  let fixture: ComponentFixture<TestWiseSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestWiseSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestWiseSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
