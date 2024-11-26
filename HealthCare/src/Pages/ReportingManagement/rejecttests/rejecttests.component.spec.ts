import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejecttestsComponent } from './rejecttests.component';

describe('RejecttestsComponent', () => {
  let component: RejecttestsComponent;
  let fixture: ComponentFixture<RejecttestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejecttestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejecttestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
