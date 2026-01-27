import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GarageAdminDashboard } from '../garage-admin-dashboard/garage-admin-dashboard';
import { MechanicManagement } from '../mechanic-management/mechanic-management';
@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, GarageAdminDashboard, MechanicManagement],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {

}
