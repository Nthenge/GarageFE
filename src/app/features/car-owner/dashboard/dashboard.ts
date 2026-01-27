import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';


@Component({
  selector: 'app-dashboard',
  imports: [
        MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatMenuModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})

export class Dashboard implements OnInit {
      userName: string | null = ''
  
  
  constructor(private authService: AuthService) {}


  activeRequest: any = null;
  lastRequest = {
    serviceType: 'Car Maintenance',
    garageName: 'Speedy Garage',
    date: '2023-10-01'}
  

  services = [
    { id: 1, title: 'Roadside Emergency', description: 'Quick help for breakdowns on the road.' },
    { id: 2, title: 'Maintenance', description: 'Schedule regular service appointments.' },
    { id: 3, title: 'Repair', description: 'Fix your car issues with trusted mechanics.' },
    { id: 4, title: 'Garages Nearby', description: 'Find garages close to your current location.' }
  ];

  profileImage = 'assets/images/profile-placeholder.jpg';


   savedCars = [
    { id: 1, make: 'Toyota', model: 'Corolla', license: 'KDQ 114Z' },
    { id: 2, make: 'Honda', model: 'Civic', license: 'KDA 567X' }
  ];

  payments = [
    { id: 1, service: 'Oil Change', amount: 2500 },
    { id: 2, service: 'Tire Replacement', amount: 8000 }
  ];

ngOnInit(): void {
     this.userName = this.authService.getUserName();
//     fetch requests
    }

    getServiceIcon(title: string): string {
    const icons: { [key: string]: string } = {
      'Roadside Emergency': '🚨',
      'Maintenance': '🔧',
      'Repair': '⚙️',
      'Garages Nearby': '🏢'
    };
    return icons[title] || '🔧';
  }

  addCar(): void {
    // Navigate to add car page or open modal
    console.log('Add car');
  }


  };

 
