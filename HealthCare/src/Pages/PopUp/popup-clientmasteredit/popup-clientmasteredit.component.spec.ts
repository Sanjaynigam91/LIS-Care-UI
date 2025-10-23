import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupClientmastereditComponent } from './popup-clientmasteredit.component';

describe('PopupClientmastereditComponent', () => {
  let component: PopupClientmastereditComponent;
  let fixture: ComponentFixture<PopupClientmastereditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupClientmastereditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupClientmastereditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
