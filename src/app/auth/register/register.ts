import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Login } from '../login/login';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'] 
})
export class Register {

  registerForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null; 
  isLoading = false;
  serverFieldErrors: any = {};

  constructor(
    private router: Router,
    private registerBuilder: FormBuilder,
    private authService: AuthService,
    private dialogRef: MatDialogRef<Register>,
    private dialog: MatDialog   
  ) {
    this.registerForm = this.registerBuilder.group({
      firstname: ['', Validators.required],
      secondname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      role: ['', Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close({ registered: false });
  }

  openLoginFromRegister(event: Event): void {
    event.preventDefault();         
    this.dialogRef.close();          

    this.dialog.open(Login, {       
      width: '450px',
      disableClose: false,
      panelClass: 'custom-dialog-container'
    });
  }

  registerOnSubmit() {
    this.errorMessage = null;
    this.serverFieldErrors = {};

    if (this.registerForm.valid) {
      const formData = this.registerForm.value;

      if (formData.password !== formData.confirmPassword) {
        this.errorMessage = 'Passwords do not match';
        return;
      }

      this.isLoading = true;
      this.registerForm.disable();

      this.authService.register(formData).subscribe({
        next: (res) => {
          this.successMessage = res.message || 'Registration successful!';
          this.dialogRef.close({ registered: true });

          this.isLoading = false;
          this.registerForm.reset();
          this.registerForm.enable();
          
          setTimeout(() => this.router.navigate(['/login']), 500);
        },
        error: (err) => {
          this.isLoading = false;
          this.registerForm.enable();
          if (err && err.messages) {
            this.serverFieldErrors = err.messages; 
            this.errorMessage = err.message || 'Validation failed';
          } else {
            this.errorMessage = err.message || 'An unexpected error occurred';
          }
        }
      });

    } else {
      this.errorMessage = 'Please fill in all required fields correctly.';
    }
  }

  get passwordMismatch(): boolean {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;
    return password && confirmPassword && password !== confirmPassword;
  }
}
