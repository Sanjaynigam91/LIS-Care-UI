import { TestBed } from '@angular/core/testing';

import { RefreshPageService } from './refresh-page.service';

describe('RefreshPageService', () => {
  let service: RefreshPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RefreshPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
