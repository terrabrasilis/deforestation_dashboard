import { TestBed, inject } from '@angular/core/testing';

import { UserProviderService } from './user-provider.service';

describe('UserProviderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserProviderService]
    });
  });

  it('should be created', inject([UserProviderService], (service: UserProviderService) => {
    expect(service).toBeTruthy();
  }));
});
