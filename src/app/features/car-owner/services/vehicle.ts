import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class Vehicle {

  private apiUrl = Environment.authUrl;

  constructor( private http:HttpClient) {}

  getMakes(): Observable<string[]>{
    return this.http.get<string[]>(`${this.apiUrl}/automobile/make`);
  }

  getYears(): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/automobile/year`);
  }

  getEngineTypes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/automobile/engineType`)
  }

  getTransmissions(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/automobile/transmission`);
  }
  
}
