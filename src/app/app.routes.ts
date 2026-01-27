import { Routes } from '@angular/router';
import { Landing } from './landing/landing/landing';
import { SystemAdminDashboard } from './features/system-admin/system-admin-dashboard/system-admin-dashboard';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { authGuard } from './core/guards/auth-guard';
import { Redirect } from './auth/redirect';
import { ResetPasswordWrapper } from './auth/reset-password/reset-password-wrapper';

export const routes: Routes = [
    { path: '', component: Landing },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'redirect', canActivate:[authGuard], component: Redirect },

    { path: 'reset-password', component: ResetPasswordWrapper },

    { path: 'car-owner',
        loadChildren: () =>
            import('./features/car-owner/car-owner.routes').then(m=> m.Car_Owner_Routes)
    },
    { path: 'garage-admin',
        loadChildren: () =>
            import('./features/garage-admin/garage-admin.routes').then(m=> m.Garage_Admin_Routes)
    },
    { path: 'mechanic',
        loadChildren: () =>
            import('./features/mechanic/mechanic.routes').then(m=> m.Mechanic_Routes)
    },
    { path: 'system-admin', 
        loadChildren: () =>
            import('./features/system-admin/system-admin-routes').then(m=> m.System_Admin_Routes)
    }
];

