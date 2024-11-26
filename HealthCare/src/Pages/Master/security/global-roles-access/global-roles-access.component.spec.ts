import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalRolesAccessComponent } from './global-roles-access.component';

describe('GlobalRolesAccessComponent', () => {
  let component: GlobalRolesAccessComponent;
  let fixture: ComponentFixture<GlobalRolesAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalRolesAccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalRolesAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
