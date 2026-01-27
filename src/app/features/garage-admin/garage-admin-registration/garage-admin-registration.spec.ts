import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GarageAdminRegistration } from './garage-admin-registration';

describe('GarageAdminRegistration', () => {
  let component: GarageAdminRegistration;
  let fixture: ComponentFixture<GarageAdminRegistration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GarageAdminRegistration]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GarageAdminRegistration);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
