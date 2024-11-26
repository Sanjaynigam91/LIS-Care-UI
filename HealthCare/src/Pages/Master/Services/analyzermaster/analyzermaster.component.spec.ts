import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyzermasterComponent } from './analyzermaster.component';

describe('AnalyzermasterComponent', () => {
  let component: AnalyzermasterComponent;
  let fixture: ComponentFixture<AnalyzermasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyzermasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyzermasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
