import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { FormGroup, Validators } from '@angular/forms';
import { VehicleDetails } from "./vehicle-details";
import { ServiceDetails } from "./service-history";
import { PersonalDetails } from "./personal-details";
import { Router } from '@angular/router';
import { CarOwnerdetails } from '../car-owner/services/car-ownerdetails';
import { GenericForm } from '../../core/utils/generic-form';
import { StorageService } from '../../core/utils/storageservice';
import { Environment } from '../../../environment/environment';

@Component({
  selector: 'app-car-owner-registration',
  imports: [CommonModule, VehicleDetails, ServiceDetails, PersonalDetails],
  templateUrl: './car-owner-registration.html',
  styleUrl: './car-owner-registration.css'

})
export class CarOwnerRegistration implements OnInit {
  form: FormGroup;
  currentStep = -1; // Start at -1 to show intro screen first
  maxSteps = 3; // Total number of actual form steps
  steps = ['Personal Information', 'Vehicle Information', 'Service History'];

  constructor(
    private ownerform: FormBuilder,
    private router: Router,
    private genericForm: GenericForm,
    private carownerdetails: CarOwnerdetails,
    private storageService: StorageService
  ) {
    // Parent form with 3 nested groups
    this.form = this.ownerform.group({
      personal: this.ownerform.group({
        profilePic: [null],
        altPhone: ['', [Validators.pattern(/^[0-9]{10}$/)]],
      }),

      vehicle: this.ownerform.group({
        make: ['', Validators.required],
        model: ['', Validators.required],
        year: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
        licensePlate: ['', Validators.required],
        engineType: [''],
        engineCapacity: [''],
        color: [''],
        transmission: ['']
      }),

      history: this.ownerform.group({
        severity: ['', Validators.required]
      })
    });
  }

  get personalForm(): FormGroup {
    return this.form.get('personal') as FormGroup;
  }

  get vehicleForm(): FormGroup {
    return this.form.get('vehicle') as FormGroup;
  }

  get historyForm(): FormGroup {
    return this.form.get('history') as FormGroup;
  }

  ngOnInit() {
    const token = this.storageService.getItem('token');

    // Only persist if user is logged in
    if (token) {
      const storageKey = `ownerSetup_${token}`;

      // Load saved progress
      const saved = this.storageService.getItem(storageKey);
      if (saved) {
        this.form.patchValue(JSON.parse(saved));
      }

      // Save progress as user types
      this.form.valueChanges.subscribe(value => {
        this.storageService.setItem(storageKey, JSON.stringify(value));
      });
    } else {
      // If guest, just start with a clean form (no persistence)
      this.form.reset();
    }
  }

  /**
   * Calculate progress percentage
   * Returns 0 for intro screen (-1)
   * Returns percentage for actual steps (0, 1, 2)
   */
  get progress(): number {
    if (this.currentStep < 0) return 0;
    return ((this.currentStep + 1) / this.maxSteps) * 100;
  }

  /**
   * Move to next step with validation
   */
  nextStep() {
    // If on intro screen, just move to first step
    if (this.currentStep === -1) {
      this.currentStep = 0;
      this.scrollToTop();
      return;
    }

    // Validate current step before proceeding
    const currentForm = this.getCurrentStepForm();
    
    if (currentForm && currentForm.invalid) {
      currentForm.markAllAsTouched();
      alert('Please complete all required fields before proceeding.');
      return;
    }

    // Move to next step if not at the end
    if (this.currentStep < this.maxSteps - 1) {
      this.currentStep++;
      this.scrollToTop();
    }
  }

  /**
   * Move to previous step
   */
  prevStep() {
    if (this.currentStep > -1) {
      this.currentStep--;
      this.scrollToTop();
    }
  }

  /**
   * Jump to specific step
   */
  goToStep(step: number) {
    // Only allow jumping to completed steps or next step
    if (step <= this.currentStep + 1 && step >= 0 && step < this.maxSteps) {
      this.currentStep = step;
      this.scrollToTop();
    }
  }

  /**
   * Get the form group for the current step
   */
  getCurrentStepForm(): FormGroup | null {
    switch (this.currentStep) {
      case 0:
        return this.personalForm;
      case 1:
        return this.vehicleForm;
      case 2:
        return this.historyForm;
      default:
        return null;
    }
  }

  /**
   * Scroll to top of page smoothly
   */
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Handle file selection for profile picture
   */
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a valid image file (JPG, PNG, or GIF)');
        return;
      }

      this.personalForm.patchValue({ profilePic: file });
      this.personalForm.get('profilePic')?.updateValueAndValidity();
    }
  }

  /**
   * Submit the complete form
   */
  submit() {
    // Final validation
    if (this.form.invalid) {
      // Mark all fields as touched to show errors
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control instanceof FormGroup) {
          Object.keys(control.controls).forEach(subKey => {
            control.get(subKey)?.markAsTouched();
          });
        }
      });
      
      alert('Please complete all required fields.');
      return;
    }

    // Confirm submission
    const confirmSubmit = confirm('Click okay to submit your registration?');
    if (!confirmSubmit) return;
//formvalue
    const formValue = this.form.value;                      // Submit form
    this.carownerdetails.saveCarOwnerDetails(formValue).subscribe({
      next: (res) => {
        console.log('Details saved:', res);

        // Save profile data for later use
        this.storageService.setItem('profileData', JSON.stringify(this.form.value));
        
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
