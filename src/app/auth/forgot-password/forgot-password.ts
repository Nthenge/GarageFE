import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../core/auth/auth.service';
import { AuthDialog } from '../../core/auth/auth-dialog';
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {
  forgotPasswordForm: FormGroup;
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  emailSent = false; // Track if email was sent successfully

  constructor(
    private fb: FormBuilder,
    
    private authService: AuthService,
    private authDialog: AuthDialog,
    private dialogRef: MatDialogRef<ForgotPassword>
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  openLoginDialog(): void {
    this.authDialog.openLogin();
  }

  openForgotPasswordDialog(): void {
    this.authDialog.openForgotPassword();
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.errorMessage = null;
      this.successMessage = null;
      this.isLoading = true;
      this.forgotPasswordForm.disable();

      const email = this.forgotPasswordForm.value.email;

      this.authService.forgotPassword(email).subscribe({
        next: (res) => {
          this.successMessage = res.message || 'Password reset link sent to your email!';
          this.emailSent = true;
          this.isLoading = false;
          this.forgotPasswordForm.enable();
          
          // Auto close after 3 seconds
          setTimeout(() => {
            this.dialogRef.close({ emailSent: true });
          }, 10000);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Failed to send reset email. Please try again.';
          this.isLoading = false;
          this.forgotPasswordForm.enable();
        }
      });
    } else {
      this.errorMessage = 'Please enter a valid email address.';
    }
  }

  // Resend email
  resendEmail(): void {
    this.emailSent = false;
    this.successMessage = null;
    this.errorMessage = null;
  }
}