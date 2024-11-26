import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SamplecollectionComponent } from './samplecollection.component';

describe('SamplecollectionComponent', () => {
  let component: SamplecollectionComponent;
  let fixture: ComponentFixture<SamplecollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SamplecollectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SamplecollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
