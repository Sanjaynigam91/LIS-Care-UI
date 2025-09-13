import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickreportsentryComponent } from './quickreportsentry.component';

describe('QuickreportsentryComponent', () => {
  let component: QuickreportsentryComponent;
  let fixture: ComponentFixture<QuickreportsentryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickreportsentryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickreportsentryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
