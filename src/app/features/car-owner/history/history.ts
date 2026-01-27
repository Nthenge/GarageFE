import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ServiceDetails } from '../service-details/service-details';


@Component({
  selector: 'app-service-history',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatCardModule,
    MatTooltipModule,
    MatDialogModule
  ],
  templateUrl: './history.html',
  styleUrl: './history.css'
})
export class History implements OnInit {


  constructor(public dialog: MatDialog) {}

  displayedColumns: string[] = [
    'date',
    'serviceType',
    'garage',
    'price',
    'status',
    'actions'
  ];

  dataSource = new MatTableDataSource<any>([]);
  filters = ['All', 'Repair', 'Maintenance', 'Emergency'];
  activeFilter = 'All';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {

    /*

    this.serviceHistory.getAll().subscribe({
    next: data => this.dataSource.data = data,
    error: err => console.error('Failed to load service history', err)
  });
}  */


    // Mock data 
    this.dataSource.data = [
       {
    date: '2025-09-22',
    serviceType: 'Repair',
    garage: 'AutoFix Garage',
    price: 4500,
    status: 'Completed',
    issues: ['Brake pad replacement', 'Oil leak fix'],
    notes: 'Customer requested brake check, found worn pads.',
    review: 'Excellent service, timely repair.'
  },
  {
    date: '2025-09-28',
    serviceType: 'Maintenance',
    garage: 'Speedy Motors',
    price: 3000,
    status: 'In Progress'
  }
];
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
    if (filter === 'All') {
      this.dataSource.filter = '';
    } else {
      this.dataSource.filter = filter.toLowerCase();
    }
  }

  viewDetails(service: any) {
    
     this.dialog.open(ServiceDetails, {
    width: '500px',
    data: service,
    //   data: { id: service.id },
    enterAnimationDuration: '250ms',
    exitAnimationDuration: '200ms',
    panelClass: 'custom-dialog-container'
  });
}

currentPage = 1;
  totalPages = 1;

  getServiceIcon(serviceType: string): string {
    const icons: { [key: string]: string } = {
      'Repair': '⚙️',
      'Maintenance': '🔧',
      'Emergency': '🚨',
      'Inspection': '🔍'
    };
    return icons[serviceType] || '🔧';
  }


}
