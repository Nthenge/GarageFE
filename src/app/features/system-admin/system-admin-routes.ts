import {Routes} from "@angular/router";
import { SystemAdminDashboard } from "./system-admin-dashboard/system-admin-dashboard";
import { ServiceCategories } from "./service-categories/service-categories";
import { authGuard } from "../../core/guards/auth-guard";

export const System_Admin_Routes: Routes = [
    {path: '', 
        canActivateChild: [authGuard], 
        data: {role: 'SYSTEM_ADMIN'},
        children: [
            {path: 'dashboard', component: SystemAdminDashboard},
            {path: 'servicecategories', component: ServiceCategories},
            {path: '', redirectTo: 'dashboard', pathMatch: 'full'}
]
    }

]