import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'add-mechanic',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-mechanic-component.html',
  styleUrl: '../mechanic-management.css' 
})

export class AddMechanicComponent {
  mechanicForm: FormGroup;
  isSubmitting = false;

 private apiUrl = 'http://172.19.240.1:8083';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.mechanicForm = this.fb.group({
      firstname: ['', [Validators.required]],
      secondname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]]
    });
  }

  onSubmit() {
    if (this.mechanicForm.invalid) {
      this.mechanicForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const payload = this.mechanicForm.value;

    this.http.post(`${this.apiUrl}/user/garage/register/mechanic`, payload).subscribe({
      next: (res) => {
        alert('Mechanic created successfully!');
        this.router.navigate(['/garage-admin/mechanic-management']); // Go back to list
      },
      error: (err) => {
        console.error(err);
        alert('Error creating mechanic. Please try again.');
        this.isSubmitting = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/garage-admin/mechanic-management']);
  }
}
