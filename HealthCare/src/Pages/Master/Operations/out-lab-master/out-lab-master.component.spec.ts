import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutLabMasterComponent } from './out-lab-master.component';

describe('OutLabMasterComponent', () => {
  let component: OutLabMasterComponent;
  let fixture: ComponentFixture<OutLabMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutLabMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutLabMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
