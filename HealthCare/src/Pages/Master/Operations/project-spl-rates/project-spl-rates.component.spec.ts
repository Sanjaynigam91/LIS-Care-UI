import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSplRatesComponent } from './project-spl-rates.component';

describe('ProjectSplRatesComponent', () => {
  let component: ProjectSplRatesComponent;
  let fixture: ComponentFixture<ProjectSplRatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectSplRatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectSplRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
