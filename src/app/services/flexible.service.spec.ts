import { TestBed } from '@angular/core/testing';

import { FlexibleService } from './flexible.service';

describe('FlexibleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FlexibleService = TestBed.get(FlexibleService);
    expect(service).toBeTruthy();
  });
});
