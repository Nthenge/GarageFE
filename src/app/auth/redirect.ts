import { Component, OnInit } from "@angular/core";
import { AuthService } from "../core/auth/auth.service";
import { Router } from "@angular/router";
import {DASHBOARD_ROUTES, SETUP_ROUTES} from '../core/guards/auth-guard'

@Component({
  selector: 'app-redirect',
  template: `<p>Redirecting...</p>` 
})
export class Redirect implements OnInit{
  constructor (private authService: AuthService, 
               private router: Router) {}

  ngOnInit(): void {
    const role = this.authService.getRole();
    const hasDetails = this.authService.hasCompletedDetails();


  console.log('Role:', role);
  console.log('Has Details:', hasDetails);
  console.log('Dashboard route:', DASHBOARD_ROUTES[role!]);
  console.log('Setup route:', SETUP_ROUTES[role!]);

   if (!role || !DASHBOARD_ROUTES[role] || !SETUP_ROUTES[role]) {
  this.router.navigate(['/login']);
  return;
}

    if (role && hasDetails){
      this.router.navigate([DASHBOARD_ROUTES[role]]);
    }else{
      this.router.navigate([SETUP_ROUTES[role]]);
    }
  }
}
