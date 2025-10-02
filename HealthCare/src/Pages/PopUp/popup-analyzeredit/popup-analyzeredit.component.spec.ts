import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupAnalyzereditComponent } from './popup-analyzeredit.component';

describe('PopupAnalyzereditComponent', () => {
  let component: PopupAnalyzereditComponent;
  let fixture: ComponentFixture<PopupAnalyzereditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupAnalyzereditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupAnalyzereditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
