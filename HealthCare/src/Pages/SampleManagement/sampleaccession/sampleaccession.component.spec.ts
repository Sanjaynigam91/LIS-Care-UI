import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleaccessionComponent } from './sampleaccession.component';

describe('SampleaccessionComponent', () => {
  let component: SampleaccessionComponent;
  let fixture: ComponentFixture<SampleaccessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SampleaccessionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SampleaccessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
