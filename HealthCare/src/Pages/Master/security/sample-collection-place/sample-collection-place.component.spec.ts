import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleCollectionPlaceComponent } from './sample-collection-place.component';

describe('SampleCollectionPlaceComponent', () => {
  let component: SampleCollectionPlaceComponent;
  let fixture: ComponentFixture<SampleCollectionPlaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SampleCollectionPlaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SampleCollectionPlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
