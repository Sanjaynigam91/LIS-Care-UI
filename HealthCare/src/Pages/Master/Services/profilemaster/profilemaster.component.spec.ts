import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilemasterComponent } from './profilemaster.component';

describe('ProfilemasterComponent', () => {
  let component: ProfilemasterComponent;
  let fixture: ComponentFixture<ProfilemasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilemasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilemasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
