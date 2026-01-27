import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechanicRegistration } from './mechanic-registration';

describe('MechanicRegistration', () => {
  let component: MechanicRegistration;
  let fixture: ComponentFixture<MechanicRegistration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MechanicRegistration]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MechanicRegistration);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
