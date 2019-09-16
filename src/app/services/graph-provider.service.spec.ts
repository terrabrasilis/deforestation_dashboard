import { TestBed, inject } from '@angular/core/testing';

import { GraphProviderService } from './graph-provider.service';

describe('GraphProviderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GraphProviderService]
    });
  });

  it('should be created', inject([GraphProviderService], (service: GraphProviderService) => {
    expect(service).toBeTruthy();
  }));
});
