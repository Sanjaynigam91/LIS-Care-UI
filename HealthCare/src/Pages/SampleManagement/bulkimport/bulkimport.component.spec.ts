import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkimportComponent } from './bulkimport.component';

describe('BulkimportComponent', () => {
  let component: BulkimportComponent;
  let fixture: ComponentFixture<BulkimportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkimportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkimportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
