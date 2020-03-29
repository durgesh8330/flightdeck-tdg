import { TestBed, inject } from '@angular/core/testing';

import { WorkmateService } from './workmate.service';

describe('WorkmateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkmateService]
    });
  });

  it('should be created', inject([WorkmateService], (service: WorkmateService) => {
    expect(service).toBeTruthy();
  }));
});
