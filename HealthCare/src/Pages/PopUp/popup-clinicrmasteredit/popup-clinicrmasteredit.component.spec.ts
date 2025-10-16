import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupClinicrmastereditComponent } from './popup-clinicrmasteredit.component';

describe('PopupClinicrmastereditComponent', () => {
  let component: PopupClinicrmastereditComponent;
  let fixture: ComponentFixture<PopupClinicrmastereditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupClinicrmastereditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupClinicrmastereditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
