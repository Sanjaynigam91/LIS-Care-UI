import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRoleMasterComponent } from './user-role-master.component';

describe('UserRoleMasterComponent', () => {
  let component: UserRoleMasterComponent;
  let fixture: ComponentFixture<UserRoleMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRoleMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRoleMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
