import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopuppendingcollectionComponent } from './popuppendingcollection.component';

describe('PopuppendingcollectionComponent', () => {
  let component: PopuppendingcollectionComponent;
  let fixture: ComponentFixture<PopuppendingcollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopuppendingcollectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopuppendingcollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
