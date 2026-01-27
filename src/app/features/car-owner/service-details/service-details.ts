import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HistoryService } from '../services/history-service';


@Component({
  selector: 'app-service-details',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, MatButtonModule, MatDividerModule, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './service-details.html',
  styleUrls: ['./service-details.css']
})
export class ServiceDetails implements OnInit {
  serviceDetails: any;
  loading = true;

  constructor(
    private historyService: HistoryService,
    public dialogRef: MatDialogRef<ServiceDetails>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.historyService.getById(this.data.id).subscribe({
      next: res => {
        this.serviceDetails = res;
        this.loading = false;
      },
      error: err => {
        console.error('Error fetching service details', err);
        this.loading = false;
      }
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}

