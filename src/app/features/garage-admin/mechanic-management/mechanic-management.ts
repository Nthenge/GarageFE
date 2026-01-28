import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

interface Mechanic {
  id: string;
  name: string;
  rating: number;
  completedJobs: number;
  specialization?: string;
  email?: string;
  phone?: string;
  isActive?: boolean;
}

@Component({
  selector: 'app-mechanic-management',
  imports: [RouterModule],
  templateUrl: './mechanic-management.html',
  styleUrl: './mechanic-management.css'
})
export class MechanicManagement implements OnInit {

  mechanics: Mechanic[] = [];

  ngOnInit(): void {
    this.loadMechanics();
  }

  loadMechanics(): void {
    this.mechanics = [
      {
        id: '1',
        name: 'James Kimani',
        specialization: 'Engine Specialist',
        email: 'james.k@garage.com',
        phone: '+254 700 123 456',
        rating: 4.9,
        completedJobs: 45,
        isActive: true
      },
      {
        id: '2',
        name: 'Peter Otieno',
        specialization: 'Brake & Suspension',
        email: 'peter.o@garage.com',
        phone: '+254 701 234 567',
        rating: 4.8,
        completedJobs: 38,
        isActive: true
      },
      {
        id: '3',
        name: 'David Mwangi',
        specialization: 'Electrical Systems',
        email: 'david.m@garage.com',
        phone: '+254 702 345 678',
        rating: 4.7,
        completedJobs: 35,
        isActive: false
      },
      {
        id: '4',
        name: 'John Omondi',
        specialization: 'General Maintenance',
        email: 'john.o@garage.com',
        phone: '+254 703 456 789',
        rating: 4.6,
        completedJobs: 30,
        isActive: true
      }
    ];
  }

  viewMechanic(mechanic: Mechanic): void {
    console.log('Viewing mechanic:', mechanic);
  }

  editMechanic(mechanic: Mechanic): void {
    console.log('Editing mechanic:', mechanic);
  }

  removeMechanic(mechanic: Mechanic): void {
    if (confirm(`Are you sure you want to remove ${mechanic.name}?`)) {
      console.log('Removing mechanic:', mechanic);
      // API call to remove mechanic
    }
  }


}
