import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ResetPassword } from './reset-password';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-reset-password-wrapper',
  template: '' // modal opens automatically
})
export class ResetPasswordWrapper implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    
    if (!token) {
      // If no token, redirect to login
      this.router.navigate(['/login']);
      return;
    }

    // Verify token with backend before opening modal
    this.authService.verifyResetToken(token).subscribe({
      next: (res) => {
        if (res.valid) {
          // Open Reset Password Modal
          const dialogRef = this.dialog.open(ResetPassword, {
            width: '450px', 
            disableClose: true,
            data: { token }
          });

          // Redirect after modal closes
          dialogRef.afterClosed().subscribe(() => {
            this.router.navigate(['/login']);
          });
        } else {
          // Invalid token, redirect or show error
          alert(res.message || 'Invalid or expired reset link');
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        // Token verification failed, redirect or show error
        alert(err.message || 'Invalid or expired reset link');
        this.router.navigate(['/login']);
      }
    });
  }
}

