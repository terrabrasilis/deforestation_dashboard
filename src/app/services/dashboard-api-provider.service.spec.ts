import { TestBed, inject } from '@angular/core/testing';

import { DashboardApiProviderService } from './dashboard-api-provider.service';

describe('DashboardApiProviderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardApiProviderService]
    });
  });

  it('should be created', inject([DashboardApiProviderService], (service: DashboardApiProviderService) => {
    expect(service).toBeTruthy();
  }));
});
