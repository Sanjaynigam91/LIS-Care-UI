import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintreportsComponent } from './printreports.component';

describe('PrintreportsComponent', () => {
  let component: PrintreportsComponent;
  let fixture: ComponentFixture<PrintreportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrintreportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintreportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
