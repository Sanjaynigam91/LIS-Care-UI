import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupAnalyzermappingComponent } from './popup-analyzermapping.component';

describe('PopupAnalyzermappingComponent', () => {
  let component: PopupAnalyzermappingComponent;
  let fixture: ComponentFixture<PopupAnalyzermappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupAnalyzermappingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupAnalyzermappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
