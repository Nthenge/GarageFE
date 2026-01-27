import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Mechanicdetails } from '../services/mechanicdetails';
import { StorageService } from '../../../core/utils/storageservice';

@Component({
  selector: 'app-mechanic-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterOutlet],
  templateUrl: './mechanic-registration.html',
  styleUrl: './mechanic-registration.css'
})
export class MechanicRegistration implements OnInit {
  setupForm!: FormGroup;
  currentStep = 1;
  totalSteps = 3;
  submitted = false;
  isSubmitting = false;
  serverError = '';

  // File storage
  files: { [key: string]: File | null } = {
    profilePic: null,
    nationalIDPic: null,
    policeClearanceCertificate: null,
    professionalCertificate: null
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private mechanicService: Mechanicdetails,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadSavedProgress();
  }

  initializeForm(): void {
    this.setupForm = this.fb.group({
      // Personal Information
      nationalIdNumber: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      alternativePhone: ['', [Validators.pattern(/^0[0-9]{9}$/)]],
      physicalAddress: ['', Validators.required],
      emergencyContactName: ['', Validators.required],
      emergencyContactNumber: ['', [Validators.required, Validators.pattern(/^0[0-9]{9}$/)]],
      
      // Professional Qualifications
      yearsOfExperience: ['', [Validators.required, Validators.min(0)]],
      vehiclebrands: ['', Validators.required],
      specializationArea: ['', Validators.required],
      garageId: ['', Validators.required]
    });

    // Auto-save on value changes
    this.setupForm.valueChanges.subscribe(value => {
      this.saveProgress();
    });
  }

  loadSavedProgress(): void {
    const saved = localStorage.getItem('mechanicSetup');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        this.setupForm.patchValue(data.formValue);
        this.currentStep = data.currentStep || 1;
      } catch (error) {
        console.error('Error loading saved progress:', error);
      }
    }
  }

  saveProgress(): void {
    const data = {
      formValue: this.setupForm.value,
      currentStep: this.currentStep,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('mechanicSetup', JSON.stringify(data));
  }

  onFileChange(event: Event, fileType: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        input.value = '';
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        alert('Only JPG, PNG, and PDF files are allowed');
        input.value = '';
        return;
      }

      this.files[fileType] = file;
      console.log(`${fileType} file selected:`, file.name);
    }
  }

  nextStep(): void {
    // Validate current step before proceeding
    if (this.currentStep === 1) {
      const personalFields = [
        'nationalIdNumber',
        'physicalAddress',
        'emergencyContactName',
        'emergencyContactNumber'
      ];
      
      let isValid = true;
      personalFields.forEach(field => {
        const control = this.setupForm.get(field);
        if (control?.invalid) {
          control.markAsTouched();
          isValid = false;
        }
      });

      if (!isValid) {
        this.submitted = true;
        return;
      }
    }

    if (this.currentStep === 2) {
      const professionalFields = [
        'yearsOfExperience',
        'vehiclebrands',
        'specializationArea',
        'garageId'
      ];
      
      let isValid = true;
      professionalFields.forEach(field => {
        const control = this.setupForm.get(field);
        if (control?.invalid) {
          control.markAsTouched();
          isValid = false;
        }
      });

      if (!isValid) {
        this.submitted = true;
        return;
      }
    }

    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.submitted = false;
      this.saveProgress();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.submitted = false;
      this.saveProgress();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.serverError = '';

    if (this.setupForm.invalid) {
      //console.log('Form is invalid:', this.setupForm.errors);
      Object.keys(this.setupForm.controls).forEach(key => {
        const control = this.setupForm.get(key);
        if (control instanceof FormGroup) {
          Object.keys(control.controls).forEach(subKey => {
            control.get(subKey)?.markAsTouched();
          });
        }
      });
      
      alert('Please complete all required fields.');
      return;
    }

     const confirmSubmit = confirm('Click okay to submit your registration?');
    if (!confirmSubmit) return;

    

    this.isSubmitting = true;

    const formValue = this.setupForm.value;
    this.mechanicService.savemechanicDetails(formValue, this.files).subscribe({
      next: (res) => {
        console.log('Registration successful:', res);

        //store for later use
        this.storageService.setItem('mechanicProfile', JSON.stringify(res));
         // Mark as complete for guard
        this.storageService.setItem('detailsCompleted', 'true');

                // Clear the setup form from storage
        const token = this.storageService.getItem('token');
        if (token) {
          this.storageService.removeItem(`ownerSetup_${token}`);
        }

        // Show success message
        alert('Registration successful! Redirecting to your dashboard...');

        // Redirect to dashboard
        this.router.navigate(['/car-owner']);
      },
        
       error: (err) => {
        console.error('Error submitting form:', err);
        alert('There was an error submitting your registration. Please try again.');
      }


    });
  }
}
  