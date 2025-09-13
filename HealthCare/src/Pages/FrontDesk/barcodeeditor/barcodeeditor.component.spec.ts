import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarcodeeditorComponent } from './barcodeeditor.component';

describe('BarcodeeditorComponent', () => {
  let component: BarcodeeditorComponent;
  let fixture: ComponentFixture<BarcodeeditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarcodeeditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarcodeeditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
