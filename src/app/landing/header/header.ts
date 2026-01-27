
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; // Add RouterModule
import { CommonModule } from '@angular/common'; 
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Login } from '../../auth/login/login';
import { Register } from '../../auth/register/register';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, // ✅ Add this
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  sidenavOpen = false;

  constructor(
    private router: Router,
    private dialog: MatDialog
  ) {}

  toggleSidenav(): void {
    this.sidenavOpen = !this.sidenavOpen;
    
    // Prevent body scroll when sidebar is open
    if (this.sidenavOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  openLogin(): void {
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
  }

  openRegister(): void {
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
  }
}