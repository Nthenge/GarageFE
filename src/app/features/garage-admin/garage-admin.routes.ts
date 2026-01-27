import { Routes } from "@angular/router";
import { GarageAdminDashboard } from "./garage-admin-dashboard/garage-admin-dashboard";
import { GarageAdminRegistration } from "./garage-admin-registration/garage-admin-registration";
import { authGuard } from "../../core/guards/auth-guard";
import { MechanicManagement } from "./mechanic-management/mechanic-management";
import { AddMechanicComponent } from "./mechanic-management/add-mechanic-component/add-mechanic-component";
export const Garage_Admin_Routes: Routes = [
    {path: '', 
        canActivateChild: [authGuard], 
        data: {role: 'GARAGE_ADMIN'},
        children: [
    {path: 'setup', component: GarageAdminRegistration},
    {path: 'dashboard', component: GarageAdminDashboard},
    {path:'mechanic-management', component: MechanicManagement},
    { path: 'add-mechanic', component: AddMechanicComponent },
    {path: '', redirectTo: 'dashboard', pathMatch: 'full'}
]
    }

]