import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  imports: [],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings {
  openSecuritySettings(): void {
    console.log('Open security settings');
  }

  openNotificationSettings(): void {
    console.log('Open notification settings');
  }

  openPrivacySettings(): void {
    console.log('Open privacy settings');
  }

  openPaymentSettings(): void {
    console.log('Open payment settings');
  }

  openSupport(): void {
    console.log('Open support');
  }

  deleteAccount(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Delete account');
    }
  }

}
