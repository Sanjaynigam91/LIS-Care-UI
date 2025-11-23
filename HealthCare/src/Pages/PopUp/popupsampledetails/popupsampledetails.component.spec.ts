import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupsampledetailsComponent } from './popupsampledetails.component';

describe('PopupsampledetailsComponent', () => {
  let component: PopupsampledetailsComponent;
  let fixture: ComponentFixture<PopupsampledetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupsampledetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupsampledetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
