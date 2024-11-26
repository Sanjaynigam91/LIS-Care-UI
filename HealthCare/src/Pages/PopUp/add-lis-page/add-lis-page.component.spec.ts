import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLisPageComponent } from './add-lis-page.component';

describe('AddLisPageComponent', () => {
  let component: AddLisPageComponent;
  let fixture: ComponentFixture<AddLisPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddLisPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddLisPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
