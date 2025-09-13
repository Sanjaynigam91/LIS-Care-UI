import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutlabreportsentryComponent } from './outlabreportsentry.component';

describe('OutlabreportsentryComponent', () => {
  let component: OutlabreportsentryComponent;
  let fixture: ComponentFixture<OutlabreportsentryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutlabreportsentryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutlabreportsentryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
