import { TestBed } from '@angular/core/testing';

import { KongEnvironmentService } from './kong-environment.service';

describe('KongEnvironmentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KongEnvironmentService = TestBed.get(KongEnvironmentService);
    expect(service).toBeTruthy();
  });
});
