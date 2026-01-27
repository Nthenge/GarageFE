import { TestBed } from '@angular/core/testing';

import { GenericForm } from './generic-form';

describe('GenericForm', () => {
  let service: GenericForm;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenericForm);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
