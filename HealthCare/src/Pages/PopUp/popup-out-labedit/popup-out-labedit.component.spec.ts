import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupOutLabeditComponent } from './popup-out-labedit.component';

describe('PopupOutLabeditComponent', () => {
  let component: PopupOutLabeditComponent;
  let fixture: ComponentFixture<PopupOutLabeditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupOutLabeditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupOutLabeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
