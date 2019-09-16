import { TestBed, inject } from '@angular/core/testing';

import { DatasourceService } from './datasource.service';

describe('DatasourceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatasourceService]
    });
  });

  it('should be created', inject([DatasourceService], (service: DatasourceService) => {
    expect(service).toBeTruthy();
  }));
});
