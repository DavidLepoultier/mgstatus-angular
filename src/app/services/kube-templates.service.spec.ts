import { TestBed } from '@angular/core/testing';

import { KubeTemplatesService } from './kube-templates.service';

describe('KubeTemplatesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KubeTemplatesService = TestBed.get(KubeTemplatesService);
    expect(service).toBeTruthy();
  });
});
