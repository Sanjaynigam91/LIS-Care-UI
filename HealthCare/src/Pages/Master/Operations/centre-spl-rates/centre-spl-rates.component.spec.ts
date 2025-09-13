import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentreSplRatesComponent } from './centre-spl-rates.component';

describe('CentreSplRatesComponent', () => {
  let component: CentreSplRatesComponent;
  let fixture: ComponentFixture<CentreSplRatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CentreSplRatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CentreSplRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
