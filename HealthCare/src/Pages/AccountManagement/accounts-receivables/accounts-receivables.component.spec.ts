import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsReceivablesComponent } from './accounts-receivables.component';

describe('AccountsReceivablesComponent', () => {
  let component: AccountsReceivablesComponent;
  let fixture: ComponentFixture<AccountsReceivablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountsReceivablesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountsReceivablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
