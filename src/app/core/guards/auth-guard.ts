import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChildFn } from '@angular/router';
import { AuthService} from '../auth/auth.service';


export const DASHBOARD_ROUTES: Record<string, string> = {
  CAR_OWNER: '/car-owner/dashboard',
  MECHANIC: '/mechanic/dashboard',
  GARAGE_ADMIN: '/garage-admin/dashboard',
  SYSTEM_ADMIN: '/system-admin-dashboard',
};

export const SETUP_ROUTES: Record<string, string> = {
  CAR_OWNER: '/car-owner/setup',
  MECHANIC: '/mechanic/setup',
  GARAGE_ADMIN: '/garage-admin/setup',
};

/**
 * Auth Guard Flow:
 * 1. User registers (basic info + role selection) → detailsCompleted = false
 * 2. User logs in → Check detailsCompleted:
 *    - false → Redirect to role-specific setup page
 *    - true → Redirect to role-specific dashboard
 * 3. User completes setup → detailsCompleted = true → Can access dashboard
 */
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // ============================================
  // SCENARIO 1: Accessing login/register pages
  // ============================================
  if (state.url === '/login' || state.url === '/register') {
    if (authService.isLoggedIn()) {
      // Already logged in - redirect based on setup completion
      const role = authService.getRole();
      
      if (!role) {
        authService.logout();
        return true; // Stay on login page
      }

      if (authService.hasCompletedDetails()) {
        router.navigate([DASHBOARD_ROUTES[role]]);
      } else {
        router.navigate([SETUP_ROUTES[role]]); // Go complete setup first
      }
      return false;
    }
    // Not logged in - allow access to login/register
    return true;
  }

  // ============================================
  // SCENARIO 2: Must be logged in for protected routes
  // ============================================
  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  // ============================================
  // SCENARIO 3: Validate user role
  // ============================================
  const userRole = authService.getRole();
  
  if (!userRole) {
    authService.logout();
    router.navigate(['/login']);
    return false;
  }

  // ============================================
  // SCENARIO 4: Check role-based authorization
  // ============================================
  const expectedRole = route.data['role'];
  
  if (expectedRole && userRole !== expectedRole) {
    // Wrong role - redirect to correct route for their role
    if (authService.hasCompletedDetails()) {
      router.navigate([DASHBOARD_ROUTES[userRole]]);
    } else {
      router.navigate([SETUP_ROUTES[userRole]]);
    }
    return false;
  }

  // ============================================
  // SCENARIO 5: Enforce setup completion workflow
  // ============================================
  const isAccessingDashboard = state.url.includes('/dashboard');
  const isAccessingSetup = state.url.includes('/setup');
  const hasCompletedDetails = authService.hasCompletedDetails();

  // Prevent accessing dashboard without completing setup
  if (isAccessingDashboard && !hasCompletedDetails) {
    const setupRoute = SETUP_ROUTES[userRole];
    if (setupRoute) {
      router.navigate([setupRoute]);
    } else {
      console.error(`No setup route defined for role: ${userRole}`);
      router.navigate(['/login']);
    }
    return false;
  }

  // Prevent accessing setup after already completing it
  if (isAccessingSetup && hasCompletedDetails) {
    const dashboardRoute = DASHBOARD_ROUTES[userRole];
    if (dashboardRoute) {
      router.navigate([dashboardRoute]);
    } else {
      console.error(`No dashboard route defined for role: ${userRole}`);
      router.navigate(['/login']);
    }
    return false;
  }

  // ============================================
  // SCENARIO 6: All checks passed ✅
  // ============================================
  return true;
};

export const authGuardChild: CanActivateChildFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => authGuard(route, state);



// export const DASHBOARD_ROUTES: Record<string, string> = {
//   CAR_OWNER: '/car-owner/dashboard',
//   MECHANIC: '/mechanic/dashboard',
//   GARAGE_ADMIN: '/garage-admin/dashboard',
//   SYSTEM_ADMIN: '/system-admin-dashboard'
// };

// export const SETUP_ROUTES: Record<string, string> = {
//   CAR_OWNER: '/car-owner/setup',
//   MECHANIC: '/mechanic/setup',
//   GARAGE_ADMIN: '/garage-admin/setup'
// };

// export const authGuard: CanActivateFn = 
// (route: ActivatedRouteSnapshot,
//   state: RouterStateSnapshot
// ) => {

//   const authService = inject(AuthService);
//   const router = inject(Router);

//   //1. Must be logged in

//     if (state.url === '/login' || state.url === '/register') {
//     if (authService.isLoggedIn()) {
//       // Already logged in - redirect based on setup completion
//       const role = authService.getRole();
      
//       if (!role) {
//         authService.logout();
//         return true; // Stay on login page
//       }

//       if (authService.hasCompletedDetails()) {
//         router.navigate([DASHBOARD_ROUTES[role]]);
//       } else {
//         router.navigate([SETUP_ROUTES[role]]); // Go complete setup first
//       }
//       return false;
//     }
//     // Not logged in - allow access to login/register
//     return true;
//   }

//   // if (!authService.isLoggedIn()){
//   //   router.navigate(['/login']);
//   //   return false;
//   // }

//   // const role = authService.getRole();

//   //If already logged in do not go back to login..if does not work check here baki tu state.url part
 


//    if (!authService.isLoggedIn()) {
//     router.navigate(['/login']);
//     return false;
//   }


//   const userRole = authService.getRole();

//   //not authorized
//   if (!userRole || (expectedRole && userRole !== expectedRole)) {
//     router.navigate(['/login']); // not authorized..check if should go back to landing
//     return false;
//   }

// // Redirect to correct route based on completion status
// if (state.url.includes('/dashboard') && !authService.hasCompletedDetails()) {
//   router.navigate([SETUP_ROUTES[userRole!]]);
//   return false;
// }
// if (state.url.includes('/setup') && authService.hasCompletedDetails()) {
//   router.navigate([DASHBOARD_ROUTES[userRole!]]);
//   return false;
// }

//   // 5. Otherwise allow access
//   return true;
// };

// export const authGuardChild: CanActivateChildFn = (
//   route: ActivatedRouteSnapshot,
//   state: RouterStateSnapshot
// ) => authGuard(route, state);





