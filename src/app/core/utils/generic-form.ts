import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { formToFormData } from './form-data-helper';


@Injectable({
  providedIn: 'root'
})
export class GenericForm {

  constructor(private http:HttpClient) {}

   submitForm(endpoint: string, formValue: any): Observable<any> {
    const formData = formToFormData(formValue);  // Convert form to FormData
    return this.http.post(endpoint, formData);   // Send POST request
  }
  
}
