import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupProfilemastereditComponent } from './popup-profilemasteredit.component';

describe('PopupProfilemastereditComponent', () => {
  let component: PopupProfilemastereditComponent;
  let fixture: ComponentFixture<PopupProfilemastereditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupProfilemastereditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupProfilemastereditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
