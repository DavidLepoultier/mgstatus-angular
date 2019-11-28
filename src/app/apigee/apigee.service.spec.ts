import { TestBed } from '@angular/core/testing';

import { ApigeeService } from './apigee.service';

describe('ApigeeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApigeeService = TestBed.get(ApigeeService);
    expect(service).toBeTruthy();
  });
});
