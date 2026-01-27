import { TestBed } from '@angular/core/testing';

import { CarOwnerdetails } from './car-ownerdetails';

describe('CarOwnerdetails', () => {
  let service: CarOwnerdetails;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarOwnerdetails);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
