import { TestBed } from '@angular/core/testing';

import { OutLabService } from './out-lab.service';

describe('OutLabService', () => {
  let service: OutLabService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OutLabService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
