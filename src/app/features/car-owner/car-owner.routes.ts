import { Routes } from "@angular/router"
import { Dashboard } from "./dashboard/dashboard"
import { Profile } from "./profile/profile"
import { Layout } from "./layout/layout"
import { History } from "./history/history"
import { CarOwnerRegistration } from "../car-owner-registration/car-owner-registration"
import { authGuard } from "../../core/guards/auth-guard"
import { Settings } from "./settings/settings"

export const Car_Owner_Routes: Routes = [

    {path: 'setup', component: CarOwnerRegistration, canActivate: [authGuard], data: { role: 'CAR_OWNER' }},  
    {
        path: '',
        component: Layout,
        canActivateChild: [authGuard],
        data: { role: 'CAR_OWNER' },
        children: [
            { path: 'dashboard', component: Dashboard },
            { path: 'profile', component: Profile },
            { path: 'history', component: History },
            { path: 'settings', component: Settings },
            { path: '', redirectTo: 'layout', pathMatch: 'full' }

        ]
    }

]