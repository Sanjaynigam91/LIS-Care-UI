import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutLabuploadComponent } from './out-labupload.component';

describe('OutLabuploadComponent', () => {
  let component: OutLabuploadComponent;
  let fixture: ComponentFixture<OutLabuploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutLabuploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutLabuploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
