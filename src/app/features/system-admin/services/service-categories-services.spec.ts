import { TestBed } from '@angular/core/testing';

import { ServiceCategoriesServices } from './service-categories-services';

describe('ServiceCategoriesServices', () => {
  let service: ServiceCategoriesServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceCategoriesServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
