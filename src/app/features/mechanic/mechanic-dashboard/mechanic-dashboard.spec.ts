import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechanicDashboard } from './mechanic-dashboard';

describe('Dashbboard', () => {
  let component: MechanicDashboard;
  let fixture: ComponentFixture<MechanicDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MechanicDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MechanicDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
