import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsahboardComponent } from './dsahboard.component';

describe('DsahboardComponent', () => {
  let component: DsahboardComponent;
  let fixture: ComponentFixture<DsahboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DsahboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DsahboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
