import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentreBlockedComponent } from './centre-blocked.component';

describe('CentreBlockedComponent', () => {
  let component: CentreBlockedComponent;
  let fixture: ComponentFixture<CentreBlockedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CentreBlockedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CentreBlockedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
