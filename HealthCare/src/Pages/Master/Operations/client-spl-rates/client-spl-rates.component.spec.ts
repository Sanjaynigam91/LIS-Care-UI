import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSplRatesComponent } from './client-spl-rates.component';

describe('ClientSplRatesComponent', () => {
  let component: ClientSplRatesComponent;
  let fixture: ComponentFixture<ClientSplRatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientSplRatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientSplRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
