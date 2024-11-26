import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarcodeManagerComponent } from './barcode-manager.component';

describe('BarcodeManagerComponent', () => {
  let component: BarcodeManagerComponent;
  let fixture: ComponentFixture<BarcodeManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarcodeManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarcodeManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
