import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment } from '../../../../environment/environment';

export interface CarOwnerSetupRequest {
  profilePic?: File | string;
  altPhone?: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  engineType?: string;
  engineCapacity?: string;
  color?: string;
  transmission?: string;
  severity: string;
}

export interface CarOwnerFormValue {
  personal: {
    profilePic?: File | null;
    altPhone?: string;
  };
  vehicle: {
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    engineType?: string;
    engineCapacity?: string;
    color?: string;
    transmission?: string;
  };
  history: {
    severity: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CarOwnerdetails {

  private apiURL = Environment.authUrl;

   constructor( private http: HttpClient) {}


   saveCarOwnerDetails(formValue: CarOwnerFormValue): Observable<any>{

    const formData = new FormData();


      const carOwner = {
    altPhone: formValue.personal.altPhone,
    make: formValue.vehicle.make,
    model: formValue.vehicle.model,
    year: formValue.vehicle.year,
    licensePlate: formValue.vehicle.licensePlate,
    engineType: formValue.vehicle.engineType,
    engineCapacity: formValue.vehicle.engineCapacity,
    color: formValue.vehicle.color,
    transmission: formValue.vehicle.transmission,
    severity: formValue.history.severity
  };


   // Append the JSON object as a string
  formData.append('carOwner', new Blob([JSON.stringify(carOwner)], { type: 'application/json' }));


// Personal Information
    if (formValue.personal.profilePic) {
      formData.append('profilePic', formValue.personal.profilePic);
    }
    // if (formValue.personal.altPhone) {
    //   formData.append('altPhone', formValue.personal.altPhone);
    // }

    // // Vehicle Information - flatten all vehicle fields
    // const vehicle = formValue.vehicle;
    
    // // Required vehicle fields
    // formData.append('make', vehicle.make);
    // formData.append('model', vehicle.model);
    // formData.append('year', vehicle.year.toString());
    // formData.append('licensePlate', vehicle.licensePlate);

    // // Optional vehicle fields
    // if (vehicle.engineType) {
    //   formData.append('engineType', vehicle.engineType);
    // }
    // if (vehicle.engineCapacity) {
    //   formData.append('engineCapacity', vehicle.engineCapacity);
    // }
    // if (vehicle.color) {
    //   formData.append('color', vehicle.color);
    // }
    // if (vehicle.transmission) {
    //   formData.append('transmission', vehicle.transmission);
    // }

    // // Service History
    // formData.append('severity', formValue.history.severity);



        // Log what we're sending (remove in production)
    console.log('Sending car owner data to backend:');
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });


    return this.http.post(`${this.apiURL}/carOwner/create`, formData);
  }


    getCarOwnerDetails(ownerId: string): Observable<CarOwnerSetupRequest> {
    return this.http.get<CarOwnerSetupRequest>(`${this.apiURL}/carOwner/${ownerId}`);
  }
  /**
   * Delete car owner profile
   * @param ownerId - The ID of the car owner
   */
  deleteCarOwner(ownerId: string): Observable<any> {
    return this.http.delete(`${this.apiURL}/carOwner/${ownerId}`);
  }

  
   }
  

