import { TestBed } from '@angular/core/testing';

import { KongSequenceService } from './kong-sequence.service';

describe('KongSequenceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KongSequenceService = TestBed.get(KongSequenceService);
    expect(service).toBeTruthy();
  });
});
