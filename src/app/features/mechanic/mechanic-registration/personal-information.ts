import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-personal-information',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="form-section" [formGroup]="form">
      
      <!-- Profile Picture -->
      <div class="form-group">
        <label for="profilePic">Profile Picture</label>
        <input 
          type="file" 
          id="profilePic"
          formControlName="profilePic" 
          accept="image/*"
          class="input" 
        />
        <small class="helper-text">Upload a professional photo</small>
      </div>

      <!-- National ID -->
      <div class="form-group">
        <label for="nationalId">National ID Number *</label>
        <input 
          type="text" 
          id="nationalId"
          formControlName="nationalIdNumber" 
          placeholder="Enter your 8-digit National ID"
          class="input" 
        />
        <small class="error" *ngIf="form.get('nationalIdNumber')?.invalid && form.get('nationalIdNumber')?.touched">
          National ID is required (8 digits)
        </small>
      </div>

      <!-- Alternative Phone -->
      <div class="form-group">
        <label for="altPhone">Alternative Phone Number</label>
        <input 
          type="text" 
          id="altPhone"
          formControlName="alternativePhone" 
          placeholder="e.g., 0712345678" 
          class="input"
        />
        <small class="error" *ngIf="form.get('alternativePhone')?.errors?.['pattern'] && form.get('alternativePhone')?.touched">
          Must be a valid 10-digit phone number
        </small>
      </div>

      <!-- Physical Address -->
      <div class="form-group">
        <label for="address">Physical Address *</label>
        <input 
          type="text" 
          id="address"
          formControlName="physicalAddress" 
          placeholder="Street, Area, City" 
          class="input"
        />
        <small class="error" *ngIf="form.get('physicalAddress')?.invalid && form.get('physicalAddress')?.touched">
          Physical address is required
        </small>
      </div>

      <!-- Emergency Contact Name -->
      <div class="form-group">
        <label for="emergencyName">Emergency Contact Name *</label>
        <input 
          type="text" 
          id="emergencyName"
          formControlName="emergencyContactName" 
          placeholder="Full name of emergency contact" 
          class="input"
        />
        <small class="error" *ngIf="form.get('emergencyContactName')?.invalid && form.get('emergencyContactName')?.touched">
          Emergency contact name is required
        </small>
      </div>

      <!-- Emergency Contact Number -->
      <div class="form-group">
        <label for="emergencyPhone">Emergency Contact Number *</label>
        <input 
          type="text" 
          id="emergencyPhone"
          formControlName="emergencyContactNumber" 
          placeholder="e.g., 0712345678" 
          class="input"
        />
        <small class="error" *ngIf="form.get('emergencyContactNumber')?.invalid && form.get('emergencyContactNumber')?.touched">
          Emergency contact number is required (10 digits)
        </small>
      </div>

    </div>
  `,
  styles: [`
    .form-section {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    label {
      font-weight: 600;
      color: #1a1a1a;
      font-size: 0.875rem;
    }
    
    .input {
      padding: 0.75rem;
      border-radius: 8px;
      border: 2px solid #e0e0e0;
      width: 100%;
      font-size: 0.875rem;
      transition: all 0.2s;
    }
    
    .input:focus {
      outline: none;
      border-color: #ff6b35;
      box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
    }
    
    .helper-text {
      color: #999;
      font-size: 0.75rem;
    }
    
    .error {
      color: #dc2626;
      font-size: 0.75rem;
    }

    /* File input specific styling */
    input[type="file"] {
      padding: 0.5rem;
      cursor: pointer;
    }

    input[type="file"]::file-selector-button {
      padding: 0.5rem 1rem;
      background: linear-gradient(135deg, #ff6b35, #ff8c5a);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      margin-right: 1rem;
      transition: all 0.2s;
    }

    input[type="file"]::file-selector-button:hover {
      background: linear-gradient(135deg, #e55a2a, #ff6b35);
    }
  `]
})
export class PersonalInformation {
  @Input() form!: FormGroup; 
}