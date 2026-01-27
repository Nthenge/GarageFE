import { Routes } from "@angular/router";
import { MechanicDashboard } from "./mechanic-dashboard/mechanic-dashboard";
import { authGuard } from "../../core/guards/auth-guard";
import { MechanicRegistration } from "./mechanic-registration/mechanic-registration";

export const Mechanic_Routes: Routes = [
    {
        path: '',
        canActivateChild: [authGuard],
        data: {role: 'MECHANIC'},
        children: [
            {path: 'dashboard' , component: MechanicDashboard} ,
            { path: 'setup', component: MechanicRegistration, },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }

        ]
    }
]