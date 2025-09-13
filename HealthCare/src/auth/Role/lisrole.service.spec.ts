import { TestBed } from '@angular/core/testing';

import { LisroleService } from './lisrole.service';

describe('LisroleService', () => {
  let service: LisroleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LisroleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
