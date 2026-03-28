import { TestBed } from '@angular/core/testing';

import { SampleRejectionService } from './sample-rejection.service';

describe('SampleRejectionService', () => {
  let service: SampleRejectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SampleRejectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
