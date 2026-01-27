// import { DatePipe } from '@angular/common';
// import { Component, OnInit } from '@angular/core';

// interface Job {
//   id: string;
//   customerName: string;
//   serviceType: string;
//   vehicle: string;
//   timeElapsed?: string;
//   requestedTime?: string;
//   location?: string;
//   amount?: number;
//   status: string;
//   scheduledTime?: string;
// }

// interface ScheduleSlot {
//   id: string;
//   time: string;
//   service: string;
//   customer: string;
//   active: boolean;
// }

// @Component({
//   selector: 'app-mechanic-jobs',
//   imports: [DatePipe],
//   templateUrl: './mechanic-dashboard.html',
//   styleUrl: './mechanic-dashboard.css'
// })

// export class MechanicJobs implements OnInit {

//   statusTabs = ['All', 'Pending', 'In Progress', 'Completed'];
//   activeTab = 'All';
//   allJobs: Job[] = [];
//   filteredJobs: Job[] = [];
//   currentJob: Job | null = null;
//   activeJobs: Job[] = [];
//   pendingJobs: Job[] = [];
//   schedule: ScheduleSlot[] = [];
//   today = new Date();

 

//   ngOnInit(): void {
//     this.loadJobs();
//     this.loadDashboardData();
//   }

//   loadDashboardData(): void {
//     // Mock current job
//     this.currentJob = {
//       id: '1',
//       customerName: 'John Doe',
//       serviceType: 'Engine Repair',
//       vehicle: 'Toyota Camry - KAB 123X',
//       timeElapsed: '2h 30m',
//       status: 'In Progress'
//     };

//     // Mock pending jobs
//     this.pendingJobs = [
//       {
//         id: '2',
//         customerName: 'Jane Smith',
//         serviceType: 'Oil Change',
//         vehicle: 'Honda CR-V - KCA 456Y',
//         requestedTime: '30 mins ago',
//         status: 'Pending'
//       },
//       {
//         id: '3',
//         customerName: 'Mike Johnson',
//         serviceType: 'Brake Repair',
//         vehicle: 'Nissan X-Trail - KBA 789Z',
//         requestedTime: '1 hour ago',
//         status: 'Pending'
//       }
//     ];

//     // Mock schedule
//     this.schedule = [
//       {
//         id: '1',
//         time: '09:00',
//         service: 'Oil Change',
//         customer: 'Sarah Williams',
//         active: false
//       },
//       {
//         id: '2',
//         time: '11:30',
//         service: 'Engine Repair',
//         customer: 'John Doe',
//         active: true
//       },
//       {
//         id: '3',
//         time: '14:00',
//         service: 'Tire Change',
//         customer: 'David Brown',
//         active: false
//       }
//     ];

//     this.activeJobs = [this.currentJob, ...this.pendingJobs];
//   }

//   loadJobs(): void {
//     // Mock jobs data
//     this.allJobs = [
//       {
//         id: '1',
//         customerName: 'John Doe',
//         vehicle: 'Toyota Camry - KAB 123X',
//         serviceType: 'Engine Repair',
//         location: 'Westlands, Nairobi',
//         scheduledTime: 'Today, 11:30 AM',
//         amount: 8500,
//         status: 'In Progress'
//       },
//       {
//         id: '2',
//         customerName: 'Jane Smith',
//         vehicle: 'Honda CR-V - KCA 456Y',
//         serviceType: 'Oil Change',
//         location: 'Karen, Nairobi',
//         scheduledTime: 'Today, 2:00 PM',
//         amount: 3500,
//         status: 'Pending'
//       },
//       {
//         id: '3',
//         customerName: 'Mike Johnson',
//         vehicle: 'Nissan X-Trail - KBA 789Z',
//         serviceType: 'Brake Repair',
//         location: 'Kilimani, Nairobi',
//         scheduledTime: 'Tomorrow, 10:00 AM',
//         amount: 12000,
//         status: 'Pending'
//       },
//       {
//         id: '4',
//         customerName: 'Sarah Williams',
//         vehicle: 'Mazda CX-5 - KBC 321W',
//         serviceType: 'Tire Change',
//         location: 'Parklands, Nairobi',
//         scheduledTime: 'Yesterday, 3:30 PM',
//         amount: 4500,
//         status: 'Completed'
//       }
//     ];

//     this.filteredJobs = this.allJobs;
//   }

//   setTab(status: string): void {
//     this.activeTab = status;
//     if (status === 'All') {
//       this.filteredJobs = this.allJobs;
//     } else {
//       this.filteredJobs = this.allJobs.filter(
//         job => job.status.replace(' ', '') === status.replace(' ', '')
//       );
//     }
//   }

//   getCount(status: string): number {
//     if (status === 'All') return this.allJobs.length;
//     return this.allJobs.filter(
//       job => job.status.replace(' ', '') === status.replace(' ', '')
//     ).length;
//   }

//   acceptJob(job: Job): void {
//     console.log('Accepting job:', job);
//     // API call to accept job
//   }

//   declineJob(job: Job): void {
//     console.log('Declining job:', job);
//     // API call to decline job
//   }

//   completeJob(job: Job): void {
//     console.log('Completing job:', job);
//     // API call to mark job as complete
//   }

//   viewDetails(job: Job): void {
//     console.log('Viewing details:', job);
//     // Navigate to job details or open modal
//   }

// }
