import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemAdminDashboard } from './system-admin-dashboard';

describe('Dashboard', () => {
  let component: SystemAdminDashboard;
  let fixture: ComponentFixture<SystemAdminDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemAdminDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemAdminDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
