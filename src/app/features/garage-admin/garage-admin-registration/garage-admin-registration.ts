import { Component,ChangeDetectorRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DASHBOARD_ROUTES} from "../../../core/guards/auth-guard"
import { AuthService } from '../../../core/auth/auth.service';

interface Service {
  id: number;
  serviceName: string;
  description: string;
  price: number;
  avgDuration: number;
  categoryName: string;
}

@Component({
  selector: 'app-garage-admin-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './garage-admin-registration.html',
  styleUrls: ['./garage-admin-registration.css']
})
export class GarageAdminRegistration implements OnInit {

  form!: FormGroup;
  currentStep = -1;
  maxSteps = 6;
  isSubmitting = false;

  steps = [
    'Business Information',
    'Location & Contact',
    'Operating Hours',
    'Services Offered',
    'Payment Information',
    'Verification Documents'
  ];

  weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  selectedDays: string[] = [];

  timeSlots = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
  ];

  availableServices: Service[] = [];
  selectedServices: number[] = [];
 licenseFile: File | null = null;
 certificateFile: File | null = null;
 facilityFile: File | null = null;
 latitude: number | null = null;
  longitude: number | null = null;
  isLocating = false

  trackByServiceId(index: number, service: any): number {
  return service.id;
}

  private apiUrl = 'http://172.19.240.1:8083';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadSavedProgress();
    this.loadServicesFromApi();
  }

loadServicesFromApi(): void {
  this.http.get<any>(`${this.apiUrl}/service/search`).subscribe({
    next: (response) => {
      if (response.success && Array.isArray(response.data)) {
        this.availableServices = response.data;
      } else {
        console.error('Unexpected response format', response);
      }

      const saved = localStorage.getItem('garageAdminSetup');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          if (data.formValue.services) {
            this.selectedServices = JSON.parse(data.formValue.services);
          }
        } catch (error) {
          console.error('Error restoring services:', error);
        }
      }
    },
    error: (err) => console.error('Failed to load services', err)
  });
}
initializeForm(): void {
  this.form = this.fb.group({
    businessName: ['', Validators.required],
    registrationNumber: ['', Validators.required],
    licenseNumber: ['', Validators.required],

    physicalAddress: ['', Validators.required],
    businessEmail: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^0[0-9]{9}$/)]],

    operatingDays: ['', Validators.required],
    openingTime: ['', Validators.required],
    closingTime: ['', Validators.required],
    yearsInOperation: ['', [Validators.required, Validators.min(0)]], 

    services: ['', Validators.required],

    paybillNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{5,8}$/)]],
    mpesaTill: ['', Validators.required], 
    accountNumber: ['', Validators.required],

    latitude: [null, Validators.required],
    longitude: [null, Validators.required],

    businessLicense: ['', Validators.required],
    professionalCertificate: ['', Validators.required],
    facilityPhotos: ['', Validators.required]
  });

  this.form.valueChanges.subscribe(() => this.saveProgress());
}

getCurrentLocation(): void {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser');
    return;
  }

  this.isLocating = true;

  navigator.geolocation.getCurrentPosition(
    (position) => {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      
      this.form.patchValue({
        latitude: this.latitude,
        longitude: this.longitude
      });
      
      this.isLocating = false;
      this.cdr.detectChanges();
    },
    (error) => {
      this.isLocating = false;
      this.cdr.detectChanges();
      alert('Error: ' + error.message + '. Please ensure location services are on.');
    },
    { enableHighAccuracy: true }
  );
}

  loadSavedProgress(): void {
    const saved = localStorage.getItem('garageAdminSetup');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        this.form.patchValue(data.formValue);
        this.currentStep = data.currentStep || -1;

        if (data.formValue.operatingDays) {
          this.selectedDays = JSON.parse(data.formValue.operatingDays);
        }
        if (data.formValue.services) {
          this.selectedServices = JSON.parse(data.formValue.services);
        }
      } catch (error) {
        console.error('Error loading saved progress:', error);
      }
    }
  }

  saveProgress(): void {
    const data = {
      formValue: this.form.value,
      currentStep: this.currentStep,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('garageAdminSetup', JSON.stringify(data));
  }

  get progress(): number {
    if (this.currentStep < 0) return 0;
    return ((this.currentStep + 1) / this.maxSteps) * 100;
  }

  isDaySelected(day: string): boolean {
    return this.selectedDays.includes(day);
  }

  toggleDay(day: string): void {
    const index = this.selectedDays.indexOf(day);
    if (index > -1) this.selectedDays.splice(index, 1);
    else this.selectedDays.push(day);

    this.form.get('operatingDays')?.setValue(JSON.stringify(this.selectedDays));
    this.form.get('operatingDays')?.markAsTouched();
  }

 isServiceSelected(serviceId: number): boolean {
  return this.selectedServices.includes(serviceId);
}

  toggleService(serviceId: number): void {
  const index = this.selectedServices.indexOf(serviceId);
  if (index > -1) {
    this.selectedServices.splice(index, 1);
  } else {
    this.selectedServices.push(serviceId);
  }

  this.form.get('services')?.setValue(JSON.stringify(this.selectedServices));
  this.form.get('services')?.markAsTouched();
}

  onFileSelect(event: any, type: 'license' | 'professionalCertificate' | 'facilityPhotos'): void {
  const file = event.target.files[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    alert('File size must be less than 5MB');
    event.target.value = '';
    return;
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
  if (!allowedTypes.includes(file.type)) {
    alert('Only JPG, PNG, and PDF files are allowed');
    event.target.value = '';
    return;
  }

  if (type === 'license') {
    this.licenseFile = file;
    this.form.get('businessLicense')?.setValue(file.name);
  } else if (type === 'professionalCertificate') {
    this.certificateFile = file;
    this.form.get('professionalCertificate')?.setValue(file.name);
  } else if (type === 'facilityPhotos') {
    this.facilityFile = file;
    this.form.get('facilityPhotos')?.setValue(file.name);
  }
  
  this.form.get(type === 'license' ? 'businessLicense' : type)?.markAsTouched();
}

  removeFile(event: Event, type: 'license' | 'professionalCertificate' | 'facilityPhotos'): void {
  event.stopPropagation();
  
  if (type === 'license') {
    this.licenseFile = null;
    this.form.get('businessLicense')?.setValue('');
  } else if (type === 'professionalCertificate') {
    this.certificateFile = null;
    this.form.get('professionalCertificate')?.setValue('');
  } else if (type === 'facilityPhotos') {
    this.facilityFile = null;
    this.form.get('facilityPhotos')?.setValue('');
  }
}

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  nextStep(): void {
    if (this.currentStep === -1) {
      this.currentStep = 0;
      this.saveProgress();
      return;
    }
    if (!this.validateCurrentStep()) return;
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.saveProgress();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  prevStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.saveProgress();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goToStep(step: number): void {
    if (step <= this.currentStep || this.validateStepsUpTo(step - 1)) {
      this.currentStep = step;
      this.saveProgress();
    }
  }

validateCurrentStep(): boolean {
  let fieldsToValidate: string[] = [];
  switch (this.currentStep) {
    case 0: fieldsToValidate = ['businessName', 'registrationNumber', 'licenseNumber']; break;
    case 1: fieldsToValidate = ['physicalAddress', 'businessEmail', 'phoneNumber','latitude', 'longitude']; break;
    case 2: fieldsToValidate = ['operatingDays', 'openingTime', 'closingTime', 'yearsInOperation']; break;
    case 3: fieldsToValidate = ['services']; break;
    case 4: fieldsToValidate = ['paybillNumber', 'mpesaTill', 'accountNumber']; break;
    case 5: 
      fieldsToValidate = ['businessLicense', 'professionalCertificate', 'facilityPhotos']; 
      break;
  }

  let isValid = true;
  fieldsToValidate.forEach(field => {
    const control = this.form.get(field);
    if (control?.invalid) {
      control.markAsTouched();
      isValid = false;
    }
  });
  return isValid;
}

  validateStepsUpTo(step: number): boolean {
    for (let i = 0; i <= step; i++) {
      const tempStep = this.currentStep;
      this.currentStep = i;
      if (!this.validateCurrentStep()) {
        this.currentStep = tempStep;
        return false;
      }
      this.currentStep = tempStep;
    }
    return true;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

submit(): void {
  if (this.form.invalid || !this.licenseFile || !this.certificateFile || !this.facilityFile) {
    this.form.markAllAsTouched();
    return;
  }

  this.isSubmitting = true;
  const formData = new FormData();

  const rawValues = this.form.value;
  
  const garageData = {
    businessName: rawValues.businessName,
    registrationNumber: rawValues.registrationNumber,
    licenseNumber: rawValues.licenseNumber,
    physicalAddress: rawValues.physicalAddress,
    businessEmail: rawValues.businessEmail,
    phoneNumber: rawValues.phoneNumber,
    openingTime: rawValues.openingTime,
    closingTime: rawValues.closingTime,
    
    businessLocation: {
      latitude: rawValues.latitude,
      longitude: rawValues.longitude
    },
    yearsInOperation: rawValues.yearsInOperation, 
    
    paybillNumber: rawValues.paybillNumber,
    mpesaTill: rawValues.mpesaTill,
    accountNumber: rawValues.accountNumber,
    
    operatingDays: this.selectedDays,    
    services: this.selectedServices 

    
  };

  formData.append('garage', new Blob([JSON.stringify(garageData)], {
    type: 'application/json'
  }));

  formData.append('businessLicense', this.licenseFile);
  formData.append('professionalCertificate', this.certificateFile);
  formData.append('facilityPhotos', this.facilityFile);

  this.http.post(`${this.apiUrl}/garage/create`, formData).subscribe({
  next: (res: any) => {
    console.log('Success!', res);
    
    localStorage.removeItem('garageAdminSetup');

    this.authService.setDetailsCompleted(true); 

    const role = 'GARAGE_ADMIN';
    const targetPath = DASHBOARD_ROUTES[role];

    if (targetPath) {
      console.log('Navigating to dashboard:', targetPath);
      this.router.navigate([targetPath]).then(success => {
        if (!success) {
          console.error('Navigation failed - Check if route is defined in app.routes.ts');
        }
      });
    }
  },
  error: (err) => {
    this.isSubmitting = false;
    console.error('Upload failed', err);
    alert('Failed to submit application. Please check all fields.');
  }
});
}
}
