import { TestBed, inject } from '@angular/core/testing';

import { SessionExpirationAlertService } from './session-expiration-alert.service';

describe('SessionExpirationAlertService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessionExpirationAlertService]
    });
  });

  it('should be created', inject([SessionExpirationAlertService], (service: SessionExpirationAlertService) => {
    expect(service).toBeTruthy();
  }));
});
