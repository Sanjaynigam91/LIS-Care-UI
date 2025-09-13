import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicMasterComponent } from './clinic-master.component';

describe('ClinicMasterComponent', () => {
  let component: ClinicMasterComponent;
  let fixture: ComponentFixture<ClinicMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClinicMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClinicMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
