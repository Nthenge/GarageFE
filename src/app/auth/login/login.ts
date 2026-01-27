import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService} from '../../core/auth/auth.service';
import { Router } from '@angular/router';
import { DASHBOARD_ROUTES, SETUP_ROUTES } from '../../core/guards/auth-guard';
import { MatDialog, MatDialogRef, MatDialogModule } from "@angular/material/dialog";
import { ForgotPassword } from '../forgot-password/forgot-password';
import { AuthDialog } from '../../core/auth/auth-dialog';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  loginForm: FormGroup;
  errorMessage: string | null = null;
  isLoading = false;
  successMessage = ''


  constructor(
    private loginbuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private dialogRef: MatDialogRef<Login>,
    private dialog: MatDialog,
    private authDialog: AuthDialog
    

  ) 
  {
    this.loginForm = this.loginbuilder.group({

      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]

    });
  }

    openForgotPassword(): void {
    this.dialogRef.close(); 
    
    const forgotPasswordDialog = this.dialog.open(ForgotPassword, {
      width: '450px',
      disableClose: false,
      panelClass: 'custom-dialog-container'
    });

    forgotPasswordDialog.afterClosed().subscribe(result => {
      if (result?.emailSent) {
        console.log('Password reset email sent');
      }
    });
  }

  openRegister(): void{
    this.authDialog.openRegister();
  }

   onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.errorMessage = null;  
      this.successMessage = '';
      this.isLoading = true;     
      this.loginForm.disable();

      const { email, password } = this.loginForm.value;

      this.authService.login({email,password}).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.loginForm.enable();
          this.successMessage = `Welcome back, ${res.data.firstname || 'User'}!`

          const role = res.data.role;
          const detailsCompleted = res.data.detailsCompleted;
          console.log('Login response - Role:', role, 'Details Completed:', detailsCompleted);
          let navigatePath: string[] | null = null;
          if (role) {
            if (detailsCompleted) {
              if (DASHBOARD_ROUTES[role]) {
                navigatePath = DASHBOARD_ROUTES[role].replace(/^\//, '').split('/');
                console.log('Navigating to dashboard:', navigatePath);
              } else {
                this.errorMessage = 'No dashboard route found for this role.';
              }
            } else {
              if (SETUP_ROUTES[role]) {
                navigatePath = SETUP_ROUTES[role].replace(/^\//, '').split('/');
                console.log('Navigating to setup:', navigatePath);
              } else if (DASHBOARD_ROUTES[role]) {
                navigatePath = DASHBOARD_ROUTES[role].replace(/^\//, '').split('/');
                console.log('Navigating to dashboard (fallback):', navigatePath);
              } else {
                this.errorMessage = 'No route found for this role.';
              }
            }
          } else {
            this.errorMessage = 'No role found in response.';
          }

          if (navigatePath) {
            this.router.navigate(navigatePath).then(result => {
              console.log('Navigation result:', result);
              this.dialogRef.close({loggedIn: true, role: res.data.role});
            }).catch(err => {
              console.error('Navigation error:', err);
              this.errorMessage = 'Navigation failed.';
              this.isLoading = false;
              this.loginForm.enable();
            });
          } else {
            this.dialogRef.close({loggedIn: true, role: res.data.role});
          }


        },
        // error messages from backend
        error: (err) => {

          console.error('Login error:', err)
          this.errorMessage = err.message || 'Invalid credentials. Please try again';
          this.isLoading = false; 
          this.loginForm.enable();

        }
      });
    } else {
      this.errorMessage = 'Please fill all required fields';
    }
  }
}






