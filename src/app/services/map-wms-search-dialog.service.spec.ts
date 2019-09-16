import { TestBed, inject } from '@angular/core/testing';

import { MapWmsSearchDialogService } from './map-wms-search-dialog.service';

describe('MapWmsSearchDialogService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapWmsSearchDialogService]
    });
  });

  it('should be created', inject([MapWmsSearchDialogService], (service: MapWmsSearchDialogService) => {
    expect(service).toBeTruthy();
  }));
});
