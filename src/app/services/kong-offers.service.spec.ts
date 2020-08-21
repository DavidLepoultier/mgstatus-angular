import { TestBed } from '@angular/core/testing';

import { KongOffersService } from './kong-offers.service';

describe('KongOffersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KongOffersService = TestBed.get(KongOffersService);
    expect(service).toBeTruthy();
  });
});
