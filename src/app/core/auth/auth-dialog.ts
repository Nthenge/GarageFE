import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Login } from '../../auth/login/login';
import { Register } from '../../auth/register/register';
import { ForgotPassword } from '../../auth/forgot-password/forgot-password';

@Injectable({
  providedIn: 'root'
})
export class AuthDialog {


  constructor(private dialog: MatDialog) {}

  openLogin(): MatDialogRef<Login> {
    const dialogRef = this.dialog.open(Login, {
      width: '450px',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.loggedIn) {
        console.log('User logged in!', result.role);
        // You can add navigation logic here based on role
      }
    });

    return dialogRef;
  }

    // --- Open Forgot Password Dialog ---
  
      openForgotPassword(): MatDialogRef<ForgotPassword> {
      const forgotPasswordDialog = this.dialog.open(ForgotPassword, {
        width: '450px',
        panelClass: 'custom-dialog-container'
      });
  
      forgotPasswordDialog.afterClosed().subscribe(result => {
        if (result?.emailSent) {
          console.log('Password reset email sent');
        }
      });
      return forgotPasswordDialog;
    }

  openRegister(): MatDialogRef<Register> {
    const dialogRef = this.dialog.open(Register, {
      width: '600px',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.registered) {
        console.log('User registered successfully');
        this.openLogin();
      }
    });

    return dialogRef;
  }
  
}
