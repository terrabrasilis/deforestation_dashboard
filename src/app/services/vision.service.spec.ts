import { TestBed, inject } from '@angular/core/testing';

import { VisionService } from './vision.service';

describe('VisionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VisionService]
    });
  });

  it('should be created', inject([VisionService], (service: VisionService) => {
    expect(service).toBeTruthy();
  }));
});
