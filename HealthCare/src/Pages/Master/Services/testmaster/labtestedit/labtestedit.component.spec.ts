import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabtesteditComponent } from './labtestedit.component';

describe('LabtesteditComponent', () => {
  let component: LabtesteditComponent;
  let fixture: ComponentFixture<LabtesteditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabtesteditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabtesteditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
