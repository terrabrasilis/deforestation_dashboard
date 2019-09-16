import { TestBed, inject } from '@angular/core/testing';

import { WmsCapabilitiesProviderService } from './wms-capabilities-provider.service';

describe('WmsCapabilitiesProviderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WmsCapabilitiesProviderService]
    });
  });

  it('should be created', inject([WmsCapabilitiesProviderService], (service: WmsCapabilitiesProviderService) => {
    expect(service).toBeTruthy();
  }));
});
