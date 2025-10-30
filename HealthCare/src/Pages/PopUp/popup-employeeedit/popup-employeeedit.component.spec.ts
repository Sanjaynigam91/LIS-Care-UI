import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupEmployeeeditComponent } from './popup-employeeedit.component';

describe('PopupEmployeeeditComponent', () => {
  let component: PopupEmployeeeditComponent;
  let fixture: ComponentFixture<PopupEmployeeeditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupEmployeeeditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupEmployeeeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
