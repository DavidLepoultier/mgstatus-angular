import { TestBed } from '@angular/core/testing';

import { NotifierSvc } from './notifier.service';

describe('NotifierService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NotifierSvc = TestBed.get(NotifierSvc);
    expect(service).toBeTruthy();
  });
});
