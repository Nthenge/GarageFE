import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GarageAdminDashboard } from './garage-admin-dashboard';

describe('GarageAdminDashboard', () => {
  let component: GarageAdminDashboard;
  let fixture: ComponentFixture<GarageAdminDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GarageAdminDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GarageAdminDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
