import { TestBed, inject } from '@angular/core/testing';

import { DashboardLoiSearchService } from './dashboard-loi-search.service';

describe('DashboardLoiSearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardLoiSearchService]
    });
  });

  it('should be created', inject([DashboardLoiSearchService], (service: DashboardLoiSearchService) => {
    expect(service).toBeTruthy();
  }));
});
