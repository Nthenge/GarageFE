import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface GarageData {
  id: number | null;
  businessName: string | null;
  registrationNumber: string | null;
  licenseNumber: string | null;
  physicalAddress: string | null;
  businessEmail: string | null;
  phoneNumber: string | null;
  operatingDays: string | null;
  openingTime: string | null;
  closingTime: string | null;
  services: string | null;
  paybillNumber: string | null;
  accountNumber: string | null;
}

interface Job {
  id: number;
  customer: string;
  vehicle: string;
  service: string;
  mechanic: string;
  status: string;
  date: string;
  amount: number;
}

interface Mechanic {
  id: number;
  name: string;
  rating: number;
  completedJobs: number;
}

interface Service {
  id: string;
  name: string;
  icon: string;
  price: number;
}

@Component({
  selector: 'app-garage-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './garage-admin-dashboard.html',
  styleUrl: './garage-admin-dashboard.css'
})
export class GarageAdminDashboard implements OnInit {
  
  // View State
  currentView: string = 'dashboard';
  sidebarCollapsed: boolean = false;
  editMode: boolean = false;
  showNotifications: boolean = false;
  showProfileMenu: boolean = false;
  
  // Loading States
  loadingProfile: boolean = false;
  
  // Data
  garageData: GarageData | null = null;
  activeJobsList: Job[] = [];
  filteredJobs: Job[] = [];
  topMechanics: Mechanic[] = [];
  garageServices: Service[] = [];
  
  // Stats
  activeMechanics: number = 0;
  activeJobs: number = 0;
  totalRevenue: number = 0;
  completedJobs: number = 0;
  avgJobValue: number = 0;
  totalMechanics: number = 0;
  totalServices: number = 0;
  customerRating: number = 0;
  pendingJobsCount: number = 0;
  notificationCount: number = 3;
  
  // Filters
  selectedPeriod: string = 'month';
  jobFilter: string = 'all';
  
  // Configuration
  private apiUrl = 'http://172.19.240.1:8083';
  private garageId: number = 0;

  constructor(
    private http: HttpClient, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAuthentication();
    this.loadGarageId();
    this.fetchGarageData();
    this.fetchDashboardData();
  }

  /**
   * Authentication Check
   */
  checkAuthentication(): void {
    const setupCompleted = localStorage.getItem('garageDetailsCompleted');
    if (!setupCompleted) {
      this.router.navigate(['/garage-admin-registration']);
    }
  }

  /**
   * Load Garage ID
   */
  loadGarageId(): void {
    const storedId = localStorage.getItem('garageId');
    if (storedId) {
      this.garageId = parseInt(storedId, 10);
    } else {
      const savedData = localStorage.getItem('garageAdminSetup');
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          this.garageId = parsed.id || 0;
        } catch (error) {
          console.error('Error parsing saved data:', error);
        }
      }
    }
  }

  /**
   * Fetch Garage Data
   */
  fetchGarageData(): void {
    this.loadingProfile = true;
    
    if (!this.garageId) {
      this.loadFromLocalStorage();
      this.loadingProfile = false;
      return;
    }

    this.http.get<GarageData>(`${this.apiUrl}/garage/${this.garageId}`)
      .subscribe({
        next: (data) => {
          this.garageData = data;
          this.loadingProfile = false;
          console.log('Garage data loaded:', data);
        },
        error: (error) => {
          console.error('Error fetching garage data:', error);
          this.loadFromLocalStorage();
          this.loadingProfile = false;
        }
      });
  }

  /**
   * Load from LocalStorage (Fallback)
   */
  loadFromLocalStorage(): void {
    const savedSetup = localStorage.getItem('garageAdminSetup');
    if (savedSetup) {
      try {
        const parsed = JSON.parse(savedSetup);
        this.garageData = {
          id: null,
          businessName: parsed.formValue?.businessName,
          registrationNumber: parsed.formValue?.registrationNumber,
          licenseNumber: parsed.formValue?.licenseNumber,
          physicalAddress: parsed.formValue?.physicalAddress,
          businessEmail: parsed.formValue?.businessEmail,
          phoneNumber: parsed.formValue?.phoneNumber,
          operatingDays: parsed.formValue?.operatingDays,
          openingTime: parsed.formValue?.openingTime,
          closingTime: parsed.formValue?.closingTime,
          services: parsed.formValue?.services,
          paybillNumber: parsed.formValue?.paybillNumber,
          accountNumber: parsed.formValue?.accountNumber
        };
      } catch (error) {
        console.error('Error loading from localStorage:', error);
      }
    }
  }

  /**
   * Fetch Dashboard Data
   */
  fetchDashboardData(): void {
    if (this.garageId) {
      // Fetch active jobs
      this.http.get<Job[]>(`${this.apiUrl}/garage/${this.garageId}/jobs/active`)
        .subscribe({
          next: (jobs) => {
            this.activeJobsList = jobs;
            this.filteredJobs = jobs;
            this.activeJobs = jobs.length;
            this.pendingJobsCount = jobs.filter(j => j.status === 'Pending').length;
          },
          error: () => {
            this.loadMockJobs();
          }
        });

      // Fetch mechanics
      this.http.get<Mechanic[]>(`${this.apiUrl}/garage/${this.garageId}/mechanics/top`)
        .subscribe({
          next: (mechanics) => {
            this.topMechanics = mechanics;
            this.activeMechanics = mechanics.filter(m => m.completedJobs > 0).length;
          },
          error: () => {
            this.loadMockMechanics();
          }
        });

      // Fetch services
      this.http.get<Service[]>(`${this.apiUrl}/garages/${this.garageId}/services`)
        .subscribe({
          next: (services) => {
            this.garageServices = services;
            this.totalServices = services.length;
          },
          error: () => {
            this.loadMockServices();
          }
        });

      // Fetch stats
      this.http.get<any>(`${this.apiUrl}/garages/${this.garageId}/stats`)
        .subscribe({
          next: (stats) => {
            this.totalRevenue = stats.totalRevenue || 0;
            this.completedJobs = stats.completedJobs || 0;
            this.avgJobValue = stats.avgJobValue || 0;
            this.totalMechanics = stats.totalMechanics || 0;
            this.customerRating = stats.customerRating || 0;
          },
          error: () => {
            this.loadMockStats();
          }
        });
    } else {
      this.loadMockJobs();
      this.loadMockMechanics();
      this.loadMockServices();
      this.loadMockStats();
    }
  }

  /**
   * Mock Data Loaders
   */
  loadMockJobs(): void {
    this.activeJobsList = [
      {
        id: 1,
        customer: 'John Doe',
        vehicle: 'Toyota Corolla',
        service: 'Oil Change',
        mechanic: 'Mike Johnson',
        status: 'In Progress',
        date: new Date().toISOString(),
        amount: 3500
      },
      {
        id: 2,
        customer: 'Jane Smith',
        vehicle: 'Honda Civic',
        service: 'Brake Repair',
        mechanic: 'Sarah Williams',
        status: 'Pending',
        date: new Date().toISOString(),
        amount: 8000
      },
      {
        id: 3,
        customer: 'Bob Wilson',
        vehicle: 'Nissan X-Trail',
        service: 'Tire Replacement',
        mechanic: 'Tom Brown',
        status: 'In Progress',
        date: new Date().toISOString(),
        amount: 12000
      }
    ];
    this.filteredJobs = this.activeJobsList;
    this.activeJobs = this.activeJobsList.length;
    this.pendingJobsCount = this.activeJobsList.filter(j => j.status === 'Pending').length;
  }

  loadMockMechanics(): void {
    this.topMechanics = [
      { id: 1, name: 'Mike Johnson', rating: 4.8, completedJobs: 45 },
      { id: 2, name: 'Sarah Williams', rating: 4.7, completedJobs: 38 },
      { id: 3, name: 'Tom Brown', rating: 4.6, completedJobs: 32 }
    ];
    this.activeMechanics = this.topMechanics.length;
    this.totalMechanics = this.topMechanics.length;
  }

  loadMockServices(): void {
    this.garageServices = [
      { id: '1', name: 'Oil Change', icon: '🛢️', price: 3500 },
      { id: '2', name: 'Brake Service', icon: '🛑', price: 8000 },
      { id: '3', name: 'Tire Service', icon: '🚗', price: 12000 },
      { id: '4', name: 'Engine Repair', icon: '🔧', price: 25000 },
      { id: '5', name: 'A/C Service', icon: '❄️', price: 6000 }
    ];
    this.totalServices = this.garageServices.length;
  }

  loadMockStats(): void {
    this.totalRevenue = 450000;
    this.completedJobs = 67;
    this.avgJobValue = 6716;
    this.customerRating = 4.7;
  }

  /**
   * Update Profile
   */
  updateProfile(): void {
    if (!this.garageId || !this.garageData) {
      alert('Unable to update profile. Please log in again.');
      return;
    }

    this.loadingProfile = true;
    
    this.http.put(`${this.apiUrl}/garages/${this.garageId}`, this.garageData)
      .subscribe({
        next: (response) => {
          console.log('Profile updated successfully:', response);
          this.editMode = false;
          this.loadingProfile = false;
          alert('Profile updated successfully!');
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          this.loadingProfile = false;
          alert('Failed to update profile. Please try again.');
        }
      });
  }

  /**
   * Update Revenue based on period
   */
  updateRevenue(): void {
    // API based on selectedPeriod
    console.log('Updating revenue for period:', this.selectedPeriod);
  }

 //filter jobs
  filterJobs(): void {
    if (this.jobFilter === 'all') {
      this.filteredJobs = this.activeJobsList;
    } else {
      this.filteredJobs = this.activeJobsList.filter(
        job => job.status.toLowerCase().replace(' ', '-') === this.jobFilter
      );
    }
  }

//View Navigation
  setView(view: string): void {
    this.currentView = view;
    this.editMode = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getPageTitle(): string {
    const titles: { [key: string]: string } = {
      dashboard: 'Dashboard',
      jobs: 'Jobs Management',
      mechanics: 'Mechanics',
      services: 'Services',
      revenue: 'Revenue',
      profile: 'Garage Profile'
    };
    return titles[this.currentView] || 'Dashboard';
  }

  // UI Controls
  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  toggleEditMode(): void {
    if (this.editMode) {
      this.updateProfile();
    } else {
      this.editMode = true;
    }
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
  }

  //job actions
  viewJobDetails(job: Job): void {
    // Navigate to job details or open modal
    console.log('View job details:', job);
    alert(`Viewing details for job: ${job.service} - ${job.customer}`);
  }

  assignMechanic(job: Job): void {
    // Open mechanic assignment modal or navigate
    console.log('Assign mechanic to job:', job);
    alert(`Assign mechanic to: ${job.service} for ${job.customer}`);
  }

  /**
   * Navigation
   */
  navigateToMechanicManagement(): void {
    this.router.navigate(['/garage-admin/mechanic-management']);
  }

  /**
   * Utility Methods
   */
  getOperatingDays(): string {
    if (!this.garageData?.operatingDays) return 'N/A';
    try {
      const days = JSON.parse(this.garageData.operatingDays);
      return Array.isArray(days) ? days.join(', ') : this.garageData.operatingDays;
    } catch {
      return this.garageData.operatingDays;
    }
  }

  /**
   * Logout
   */
  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('garageDetailsCompleted');
      localStorage.removeItem('garageId');
      localStorage.removeItem('authToken');
      this.router.navigate(['/login']);
    }
  }
}
