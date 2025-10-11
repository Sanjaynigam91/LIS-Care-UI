import { TestBed } from '@angular/core/testing';

import { CenterServiceService } from './center-service.service';

describe('CenterServiceService', () => {
  let service: CenterServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CenterServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
