import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupProjecteditComponent } from './popup-projectedit.component';

describe('PopupProjecteditComponent', () => {
  let component: PopupProjecteditComponent;
  let fixture: ComponentFixture<PopupProjecteditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupProjecteditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupProjecteditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
