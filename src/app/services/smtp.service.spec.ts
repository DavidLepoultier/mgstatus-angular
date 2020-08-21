import { TestBed } from '@angular/core/testing';

import { SmtpService } from './smtp.service';

describe('SmtpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SmtpService = TestBed.get(SmtpService);
    expect(service).toBeTruthy();
  });
});
