import { TestBed } from '@angular/core/testing';

import { Mechanicdetails } from './mechanicdetails';

describe('Mechanicdetails', () => {
  let service: Mechanicdetails;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Mechanicdetails);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
