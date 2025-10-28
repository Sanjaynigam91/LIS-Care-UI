import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupOutLabMappingComponent } from './popup-out-lab-mapping.component';

describe('PopupOutLabMappingComponent', () => {
  let component: PopupOutLabMappingComponent;
  let fixture: ComponentFixture<PopupOutLabMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupOutLabMappingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupOutLabMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
