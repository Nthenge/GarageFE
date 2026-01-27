import { TestBed } from '@angular/core/testing';

import { GarageAdminDetails } from './garage-admin-details';

describe('GarageAdminDetails', () => {
  let service: GarageAdminDetails;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GarageAdminDetails);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
