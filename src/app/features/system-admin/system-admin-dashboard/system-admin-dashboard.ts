import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

interface ApprovalItem {
  id: string;
  type: string;
  title: string;
  description: string;
  submittedTime: string;
}

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  time: string;
}

@Component({
  selector: 'app-system-admin-dashboard',
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './system-admin-dashboard.html',
  styleUrl: './system-admin-dashboard.css'
})
export class SystemAdminDashboard {
   totalUsers = 1247;
  totalGarages = 85;
  platformRevenue = 2450000;
  totalJobs = 3562;
  activeJobs = 48;

  pendingApprovals: ApprovalItem[] = [];
  recentActivity: Activity[] = [];

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Mock pending approvals
    this.pendingApprovals = [
      {
        id: '1',
        type: 'garage',
        title: 'New Garage Registration',
        description: 'Elite Auto Services - Westlands, Nairobi',
        submittedTime: '2 hours ago'
      },
      {
        id: '2',
        type: 'dispute',
        title: 'Service Dispute',
        description: 'Customer complaint about incomplete brake repair',
        submittedTime: '5 hours ago'
      },
      {
        id: '3',
        type: 'garage',
        title: 'Garage Verification',
        description: 'Quick Fix Garage - Mombasa Road',
        submittedTime: '1 day ago'
      }
    ];

    // Mock recent activity
    this.recentActivity = [
      {
        id: '1',
        type: 'success',
        title: 'Garage Approved',
        description: 'Pro Auto Services has been verified and approved',
        time: '10 minutes ago'
      },
      {
        id: '2',
        type: 'warning',
        title: 'Dispute Resolved',
        description: 'Service dispute #1234 has been resolved',
        time: '1 hour ago'
      },
      {
        id: '3',
        type: 'success',
        title: 'New Service Added',
        description: 'AC Gas Refill added to Air Conditioning category',
        time: '2 hours ago'
      },
      {
        id: '4',
        type: 'error',
        title: 'Garage Suspended',
        description: 'Roadside Mechanics suspended due to violations',
        time: '3 hours ago'
      }
    ];
  }

  getApprovalIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'garage': '🏢',
      'dispute': '⚖️',
      'service': '🔧',
      'mechanic': '👨‍🔧'
    };
    return icons[type] || '📋';
  }

  approve(item: ApprovalItem): void {
    console.log('Approving:', item);
    // API call to approve
  }

  reject(item: ApprovalItem): void {
    console.log('Rejecting:', item);
    // API call to reject
  }


}
