import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupSampleAccessionConfirmationComponent } from './popup-sample-accession-confirmation.component';

describe('PopupSampleAccessionConfirmationComponent', () => {
  let component: PopupSampleAccessionConfirmationComponent;
  let fixture: ComponentFixture<PopupSampleAccessionConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupSampleAccessionConfirmationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupSampleAccessionConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
