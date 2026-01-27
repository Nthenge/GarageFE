import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'app-service-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template:` 
    <div class="service-history-form" [formGroup]="group">
    <h3>Severity of Past Repairs</h3>
    <p>Select all that apply:</p>
    
  <div *ngFor="let option of options; let i =index" class="severity-option">
    <label>
      <input type="radio" [value]="option" formControlName="severity"> {{ option }}
    </label>
    <p class="option-desc"> {{descriptions[i]}} </p>
  </div>

    @if(group.get('severity')?.invalid && (group.get('severity')?.touched || group.get('severity')?.dirty)) {
  <div class="error">
    Please select one option.
  </div>}
    </div>
  `,

   styleUrl: './car-owner-registration.css'

 
})
export class ServiceDetails {

    @Input() group!: FormGroup <any>;
      options = ['Minor Fix', 'Moderate Repair', 'Major Repair', 'Complete Overhaul'];

      descriptions = [

    'Small issues like oil change or replacing wipers.',
    'Repairs that take a few hours, e.g., brake pads.',
    'Serious repairs like engine or gearbox fixes.',
    'Full restoration, almost rebuilding the car.'

      ];


}
