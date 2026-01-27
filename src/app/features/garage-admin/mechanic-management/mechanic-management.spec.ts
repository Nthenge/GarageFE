import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechanicManagement } from './mechanic-management';

describe('MechanicManagement', () => {
  let component: MechanicManagement;
  let fixture: ComponentFixture<MechanicManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MechanicManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MechanicManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
