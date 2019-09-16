import { TestBed, inject } from '@angular/core/testing';

import { LayerInfoProviderService } from '../services/layer-info-provider.service';

describe('LayerInfoProviderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LayerInfoProviderService]
    });
  });

  it('should be created', inject([LayerInfoProviderService], (service: LayerInfoProviderService) => {
    expect(service).toBeTruthy();
  }));
});
