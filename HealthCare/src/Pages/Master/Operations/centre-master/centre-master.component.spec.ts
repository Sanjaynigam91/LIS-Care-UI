import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentreMasterComponent } from './centre-master.component';

describe('CentreMasterComponent', () => {
  let component: CentreMasterComponent;
  let fixture: ComponentFixture<CentreMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CentreMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CentreMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
