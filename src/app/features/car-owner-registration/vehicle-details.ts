import { Component, Input, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Vehicle } from '../car-owner/services/vehicle';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vehicle-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template:`
  <h3>Vehicle Information</h3>
<div class="vehicle-details-form" [formGroup]="group">

  <label>Make:</label>
  <select formControlName="make">
    <option value="">Select make...</option>
    <option *ngFor="let m of makes" [value]="m">{{ m }}</option>
  </select>

  <label>Model:</label>
  <input formControlName="model" placeholder="Enter vehicle model">

  <label>Year:</label>
  <select formControlName="year">
    <option value="">Select year...</option>
    <option *ngFor="let y of years" [value]="y">{{ y }}</option>
  </select>

  <label>License Plate:</label>
  <input formControlName="licensePlate" placeholder="e.g. KAA-123A">

  <label>Engine Type:</label>
  <select formControlName="engineType">
    <option value="">Select engine type...</option>
    <option *ngFor="let type of engineTypes" [value]="type">{{ type }}</option>
  </select>

  <label>Engine Capacity (cc):</label>
  <input formControlName="engineCapacity" placeholder="e.g. 1500">

  <label>Color:</label>
  <input type="color" formControlName="color">

  <label>Transmission:</label>
  <select formControlName="transmission">
    <option value="">Select transmission...</option>
    <option *ngFor="let t of transmissions" [value]="t">{{ t }}</option>
  </select>
</div>`,

styleUrl: './car-owner-registration.css'
 
})
export class VehicleDetails implements OnInit{
    @Input() group!: FormGroup <any>

  makes: string[] = [];
  years: number[] = [];
  engineTypes: string[] = [];
  transmissions: string[] = [];

  constructor(
  private vehicleService: Vehicle,
  private cdr: ChangeDetectorRef // Inject this
) {}

ngOnInit() {
  this.vehicleService.getMakes().subscribe((res: any) => {
    if (res && res.data) {
      this.makes = res.data.sort();
      this.restoreValue('make');
    }
  });

  // 2. Fetch Years (Notice the string-to-number conversion if needed)
  this.vehicleService.getYears().subscribe((res: any) => {
    if (res && res.data) {
      // Sort descending (2025 down to 2000)
      this.years = res.data.sort((a: any, b: any) => b - a);
      this.restoreValue('year');
    }
  });

  // 3. Fetch Engine Types
  this.vehicleService.getEngineTypes().subscribe((res: any) => {
    if (res && res.data) {
      this.engineTypes = res.data;
      this.restoreValue('engineType');
    }
  });

  // 4. Fetch Transmissions
  this.vehicleService.getTransmissions().subscribe((res: any) => {
    if (res && res.data) {
      this.transmissions = res.data;
      this.restoreValue('transmission');
    }
  });
}

  private restoreValue(controlName: string) {
  const control = this.group.get(controlName);
  if (control?.value) {
    control.setValue(control.value, { emitEvent: false });
  }
}

}
