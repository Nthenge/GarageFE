import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';

interface MechanicData {
  id?: number | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  nationalIdNumber?: string | null;
  alternativePhone?: string | null;
  physicalAddress?: string | null;
  emergencyContactName?: string | null;
  emergencyContactNumber?: string | null;
  yearsOfExperience?: number | null;
  vehiclebrands?: string | null;
  specializationArea?: string | null;
  garageId?: string | null;
  profilePicture?: string | null;
}

interface Job {
  id: number;
  customerName: string;
  serviceType: string;
  vehicle: string;
  requestedTime: string;
  timeElapsed?: string;
  status?: string;
}

interface ScheduleSlot {
  id: number;
  time: string;
  service: string;
  customer: string;
  active: boolean;
}

interface DashboardStats {
  completedJobs: number;
  rating: number;
}

interface WeeklyStats {
  jobsDone: number;
  rating: number;
  earned: number;
}

@Component({
  selector: 'app-mechanic-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mechanic-dashboard.html',
  styleUrl: './mechanic-dashboard.css'
})
export class MechanicDashboard implements OnInit, OnDestroy {
  
  // View State
  currentView: string = 'dashboard';
  sidebarCollapsed: boolean = false;
  editMode: boolean = false;
  showNotifications: boolean = false;
  showProfileMenu: boolean = false;
  
  // Loading States
  loadingProfile: boolean = false;
  
  // Data
  mechanicData: MechanicData = {};
  currentJob: Job | null = null;
  activeJobs: Job[] = [];
  pendingJobs: Job[] = [];
  schedule: ScheduleSlot[] = [];
  today: Date = new Date();
  notificationCount: number = 3;
  
  dashboardStats: DashboardStats = {
    completedJobs: 0,
    rating: 0
  };
  
  weeklyStats: WeeklyStats = {
    jobsDone: 0,
    rating: 0,
    earned: 0
  };
  
  // Configuration
  private apiUrl = 'http://172.19.240.1:8083';
  private mechanicId: number = 0;
  private timerSubscription?: Subscription;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAuthentication();
    this.loadMechanicId();
    this.fetchMechanicData();
    this.fetchDashboardData();
    this.startTimer();
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  /**
   * Authentication Check
   */
  checkAuthentication(): void {
    const setupCompleted = localStorage.getItem('mechanicDetailsCompleted');
    if (!setupCompleted) {
      this.router.navigate(['/mechanic-registration']);
    }
  }

  /**
   * Load Mechanic ID
   */
  loadMechanicId(): void {
    const storedId = localStorage.getItem('mechanicId');
    if (storedId) {
      this.mechanicId = parseInt(storedId, 10);
    } else {
      // Try to get from saved setup data
      const savedData = localStorage.getItem('mechanicSetup');
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          this.mechanicId = parsed.id || 0;
        } catch (error) {
          console.error('Error parsing saved data:', error);
        }
      }
    }
  }

  /**
   * Fetch Mechanic Profile Data
   */
  fetchMechanicData(): void {
    this.loadingProfile = true;
    
    if (!this.mechanicId) {
      this.loadFromLocalStorage();
      this.loadingProfile = false;
      return;
    }

    this.http.get<MechanicData>(`${this.apiUrl}/mechanic/search/${this.mechanicId}`)
      .subscribe({
        next: (data) => {
          this.mechanicData = data;
          this.loadingProfile = false;
          console.log('Mechanic data loaded:', data);
        },
        error: (error) => {
          console.error('Error fetching mechanic data:', error);
          this.loadFromLocalStorage();
          this.loadingProfile = false;
        }
      });
  }

  // Load from LocalStorage (Fallback)
   
  loadFromLocalStorage(): void {
    const savedSetup = localStorage.getItem('mechanicSetup');
    if (savedSetup) {
      try {
        const parsed = JSON.parse(savedSetup);
        this.mechanicData = {
          nationalIdNumber: parsed.formValue?.nationalIdNumber,
          alternativePhone: parsed.formValue?.alternativePhone,
          physicalAddress: parsed.formValue?.physicalAddress,
          emergencyContactName: parsed.formValue?.emergencyContactName,
          emergencyContactNumber: parsed.formValue?.emergencyContactNumber,
          yearsOfExperience: parsed.formValue?.yearsOfExperience,
          vehiclebrands: parsed.formValue?.vehiclebrands,
          specializationArea: parsed.formValue?.specializationArea,
          garageId: parsed.formValue?.garageId,
          name: 'John Doe',
          phone: '0712345678',
          email: 'mechanic@example.com',
          profilePicture: 'assets/default-avatar.png'
        };
      } catch (error) {
        console.error('Error loading from localStorage:', error);
      }
    }
  }

  /**
   * Fetch Dashboard Data (Jobs, Schedule, Stats)
   */
  //fetch profile
  fetchDashboardData(): void {
    // Fetch active jobs
    if (this.mechanicId) {
      this.http.get<Job[]>(`${this.apiUrl}/assignments/mechanic/${this.mechanicId}`)
        .subscribe({
          next: (jobs) => {
            this.activeJobs = jobs;
            this.currentJob = jobs.length > 0 ? jobs[0] : null;
          },
          error: () => {
            this.loadMockActiveJobs();
          }
        });

      // Fetch pending jobs
      this.http.get<Job[]>(`${this.apiUrl}/mechanics/${this.mechanicId}/jobs/pending`)
        .subscribe({
          next: (jobs) => {
            this.pendingJobs = jobs;
          },
          error: () => {
            this.loadMockPendingJobs();
          }
        });

      // Fetch schedule
      this.http.get<ScheduleSlot[]>(`${this.apiUrl}/mechanics/${this.mechanicId}/schedule/today`)
        .subscribe({
          next: (slots) => {
            this.schedule = slots;
          },
          error: () => {
            this.loadMockSchedule();
          }
        });

      // Fetch stats
      this.http.get<DashboardStats>(`${this.apiUrl}/mechanics/${this.mechanicId}/stats`)
        .subscribe({
          next: (stats) => {
            this.dashboardStats = stats;
          },
          error: () => {
            this.dashboardStats = {
              completedJobs: 47,
              rating: 4.8
            };
          }
        });

      // Fetch weekly stats
      this.http.get<WeeklyStats>(`${this.apiUrl}/mechanics/${this.mechanicId}/stats/weekly`)
        .subscribe({
          next: (stats) => {
            this.weeklyStats = stats;
          },
          error: () => {
            this.weeklyStats = {
              jobsDone: 15,
              rating: 4.8,
              earned: 42
            };
          }
        });
    } else {
      // Load mock data
      this.loadMockActiveJobs();
      this.loadMockPendingJobs();
      this.loadMockSchedule();
      this.dashboardStats = { completedJobs: 47, rating: 4.8 };
      this.weeklyStats = { jobsDone: 15, rating: 4.8, earned: 42 };
    }
  }

  /**
   * Mock Data Loaders
   */
  loadMockActiveJobs(): void {
    this.activeJobs = [
      {
        id: 1,
        customerName: 'Jane Smith',
        serviceType: 'Oil Change',
        vehicle: 'Toyota Corolla',
        requestedTime: '10:00 AM',
        timeElapsed: '00:45:00',
        status: 'in-progress'
      }
    ];
    this.currentJob = this.activeJobs[0];
  }

  loadMockPendingJobs(): void {
    this.pendingJobs = [
      {
        id: 2,
        customerName: 'Mike Johnson',
        serviceType: 'Brake Inspection',
        vehicle: 'Honda Civic',
        requestedTime: '2:00 PM'
      },
      {
        id: 3,
        customerName: 'Sarah Williams',
        serviceType: 'Tire Replacement',
        vehicle: 'Nissan X-Trail',
        requestedTime: '4:30 PM'
      }
    ];
  }

  loadMockSchedule(): void {
    this.schedule = [
      {
        id: 1,
        time: '10:00 AM',
        service: 'Oil Change',
        customer: 'Jane Smith',
        active: true
      },
      {
        id: 2,
        time: '2:00 PM',
        service: 'Brake Check',
        customer: 'Mike Johnson',
        active: false
      },
      {
        id: 3,
        time: '4:30 PM',
        service: 'Tire Service',
        customer: 'Sarah Williams',
        active: false
      }
    ];
  }

  /**
   * Timer for Current Job
   */
  startTimer(): void {
    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.currentJob && this.currentJob.timeElapsed) {
        // Update timer logic here
        const parts = this.currentJob.timeElapsed.split(':');
        let hours = parseInt(parts[0]);
        let minutes = parseInt(parts[1]);
        let seconds = parseInt(parts[2]);
        
        seconds++;
        if (seconds >= 60) {
          seconds = 0;
          minutes++;
        }
        if (minutes >= 60) {
          minutes = 0;
          hours++;
        }
        
        this.currentJob.timeElapsed = 
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }
    });
  }

  /**
   * Update Profile
   */
  updateProfile(): void {
    if (!this.mechanicId) {
      alert('Unable to update profile. Please log in again.');
      return;
    }

    this.loadingProfile = true;
    
    this.http.put(`${this.apiUrl}/mechanics/${this.mechanicId}`, this.mechanicData)
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
   * View Navigation
   */
  setView(view: string): void {
    this.currentView = view;
    this.editMode = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getPageTitle(): string {
    const titles: { [key: string]: string } = {
      dashboard: 'Dashboard',
      profile: 'My Profile',
      jobs: 'My Jobs',
      schedule: 'Schedule',
      earnings: 'Earnings'
    };
    return titles[this.currentView] || 'Dashboard';
  }

  /**
   * UI Controls
   */
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

  /**
   * Job Actions
   */
  acceptJob(job: Job): void {
    if (confirm(`Accept job: ${job.serviceType} for ${job.customerName}?`)) {
      // Call API to accept job
      if (this.mechanicId) {
        this.http.post(`${this.apiUrl}/mechanics/${this.mechanicId}/jobs/${job.id}/accept`, {})
          .subscribe({
            next: () => {
              alert('Job accepted successfully!');
              this.fetchDashboardData();
            },
            error: (error) => {
              console.error('Error accepting job:', error);
              alert('Failed to accept job. Please try again.');
            }
          });
      } else {
        // Mock behavior
        this.pendingJobs = this.pendingJobs.filter(j => j.id !== job.id);
        this.activeJobs.push(job);
        alert('Job accepted!');
      }
    }
  }

  declineJob(job: Job): void {
    if (confirm(`Decline job: ${job.serviceType} for ${job.customerName}?`)) {
      // Call API to decline job
      if (this.mechanicId) {
        this.http.post(`${this.apiUrl}/mechanics/${this.mechanicId}/jobs/${job.id}/decline`, {})
          .subscribe({
            next: () => {
              alert('Job declined.');
              this.fetchDashboardData();
            },
            error: (error) => {
              console.error('Error declining job:', error);
              alert('Failed to decline job. Please try again.');
            }
          });
      } else {
        // Mock behavior
        this.pendingJobs = this.pendingJobs.filter(j => j.id !== job.id);
        alert('Job declined.');
      }
    }
  }

  /**
   * Quick Actions
   */
  reportIssue(): void {
    alert('Report Issue feature coming soon!');
  }

  callSupport(): void {
    window.location.href = 'tel:+254712345678';
  }

  openSettings(): void {
    alert('Settings feature coming soon!');
  }

  /**
   * Logout
   */
  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('mechanicDetailsCompleted');
      localStorage.removeItem('mechanicId');
      localStorage.removeItem('authToken');
      this.router.navigate(['/login']);
    }
  }
}