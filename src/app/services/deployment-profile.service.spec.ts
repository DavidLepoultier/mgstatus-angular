import { TestBed } from '@angular/core/testing';

import { DeploymentProfileService } from './deployment-profile.service';

describe('DeploymentProfileService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeploymentProfileService = TestBed.get(DeploymentProfileService);
    expect(service).toBeTruthy();
  });
});
