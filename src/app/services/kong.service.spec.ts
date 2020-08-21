import { TestBed } from '@angular/core/testing';

import { KongService } from './kong.service';

describe('KongService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KongService = TestBed.get(KongService);
    expect(service).toBeTruthy();
  });
});
