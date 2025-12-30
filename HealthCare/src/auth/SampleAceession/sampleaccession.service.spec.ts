import { TestBed } from '@angular/core/testing';

import { SampleaccessionService } from './sampleaccession.service';

describe('SampleaccessionService', () => {
  let service: SampleaccessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SampleaccessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
