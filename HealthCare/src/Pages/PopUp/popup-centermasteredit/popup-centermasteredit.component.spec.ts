import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupCentermastereditComponent } from './popup-centermasteredit.component';

describe('PopupCentermastereditComponent', () => {
  let component: PopupCentermastereditComponent;
  let fixture: ComponentFixture<PopupCentermastereditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupCentermastereditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupCentermastereditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
