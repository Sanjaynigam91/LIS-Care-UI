import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutLabselectionComponent } from './out-labselection.component';

describe('OutLabselectionComponent', () => {
  let component: OutLabselectionComponent;
  let fixture: ComponentFixture<OutLabselectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutLabselectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutLabselectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
