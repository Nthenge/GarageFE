import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarOwnerRegistration } from './car-owner-registration';

describe('CarOwnerRegistration', () => {
  let component: CarOwnerRegistration;
  let fixture: ComponentFixture<CarOwnerRegistration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarOwnerRegistration]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarOwnerRegistration);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
