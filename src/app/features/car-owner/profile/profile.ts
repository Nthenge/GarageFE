import { Component } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  userName: string | null = '';
  profileImage = 'assets/images/profile-placeholder.jpg';
  
  editMode = {
    personal: false,
    preferences: false
  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userName = this.authService.getUserName();
  }

  toggleEdit(section: 'personal' | 'preferences'): void {
    this.editMode[section] = !this.editMode[section];
    if (!this.editMode[section]) {
      // Save changes
      console.log('Saving changes for', section);
    }
  }
}