import { TestBed, inject } from '@angular/core/testing';

import { EvcService } from './evc.service';

describe('EvcService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EvcService]
    });
  });

  it('should be created', inject([EvcService], (service: EvcService) => {
    expect(service).toBeTruthy();
  }));
});
