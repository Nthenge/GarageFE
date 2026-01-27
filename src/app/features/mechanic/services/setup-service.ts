import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { Environment } from '../../../../environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SetupService {

  
  private base = '' //Environment.authUrl;

  constructor(private http: HttpClient) {}

  // Submit the mechanic setup form (FormData)
  submitSetup(formData: FormData): Observable<any> {
    // endpoint expected to accept multipart/form-data
    return this.http.post(`${this.base}/mechanic/setup`, formData);
  }

  // Get mechanic profile (used by dashboard)
  getProfile(): Observable<any> {
    return this.http.get(`${this.base}/mechanic/profile`);
  }

  
}
