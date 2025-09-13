import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LisPageMasterComponent } from './lis-page-master.component';

describe('LisPageMasterComponent', () => {
  let component: LisPageMasterComponent;
  let fixture: ComponentFixture<LisPageMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LisPageMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LisPageMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
