
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthDialog } from '../../core/auth/auth-dialog';
//import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.css'
})
export class HeroSection {

  constructor(private router: Router,
     private authDialog: AuthDialog
  ) {}

  onGetStarted(): void {
    this.authDialog.openLogin();
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  goToLogIn(): void {
    this.router.navigate(['/login']);
  }

  scrollToFeatures(): void {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}