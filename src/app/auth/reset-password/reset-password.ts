import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword implements OnInit {

  resetPasswordForm: FormGroup;
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  token: string;
  tokenValid = false;
  checkingToken = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private dialogRef: MatDialogRef<ResetPassword>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    // Get token from injected data
    this.token = data?.token || '';

    // Initialize form
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (!this.token) {
      this.errorMessage = 'Invalid or missing reset token.';
      this.checkingToken = false;
      return;
    }

    // Verify token validity
    this.authService.verifyResetToken(this.token).subscribe({
      next: (res) => {
        this.tokenValid = res.valid;
        this.checkingToken = false;
        if (!this.tokenValid) {
          this.errorMessage = 'This reset link has expired or is invalid.';
        }
      },
      error: () => {
        this.tokenValid = false;
        this.checkingToken = false;
        this.errorMessage = 'Unable to verify reset link. Please request a new one.';
      }
    });
  }

  // Check if passwords match
  get passwordMismatch(): boolean {
    const newPass = this.resetPasswordForm.get('newPassword')?.value;
    const confirmPass = this.resetPasswordForm.get('confirmPassword')?.value;
    return newPass && confirmPass && newPass !== confirmPass;
  }

  // Close modal
  onCancel(): void {
    this.dialogRef.close();
  }

  // Submit new password
  onSubmit(): void {
    if (!this.token) {
      this.errorMessage = 'Missing reset token.';
      return;
    }

    if (this.resetPasswordForm.valid && !this.passwordMismatch) {
      this.isLoading = true;
      this.errorMessage = null;
      this.successMessage = null;
      this.resetPasswordForm.disable();

      const newPassword = this.resetPasswordForm.value.newPassword;

      this.authService.resetPassword(this.token, newPassword).subscribe({
        next: (res) => {
          this.successMessage = res.message || 'Password reset successful!';
          this.isLoading = false;

          // Close modal and redirect after short delay
          setTimeout(() => {
            this.dialogRef.close();
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Failed to reset password. Please try again.';
          this.isLoading = false;
          this.resetPasswordForm.enable();
        }
      });

    } else if (this.passwordMismatch) {
      this.errorMessage = 'Passwords do not match.';
    } else {
      this.errorMessage = 'Please fill all fields correctly.';
    }
  }
}
