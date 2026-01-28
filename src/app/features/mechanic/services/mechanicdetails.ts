import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment } from '../../../../environment/environment';

export interface MechanicPersonalInfo {
  profilePic?: File | null; 
  nationalIdNumber: string;
  alternativePhone?: string;
  physicalAddress: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
}

export interface MechanicProfessionalInfo {
  yearsOfExperience: number;
  areasOfSpecialization: string;
}

export interface MechanicSkills {
  vehicleBrands: string;
  availability: string;
}

export interface MechanicDocuments {
  profilePic:File;
  nationalIDPic: File;
  professionalCertificate: File;
  anyRelevantCertificate?: File;
  policeClearanceCertificate: File;
}

export interface MechanicRegistrationData {
  personal: MechanicPersonalInfo;
  professional: MechanicProfessionalInfo;
  skills: MechanicSkills;
  documents: MechanicDocuments;
}

@Injectable({
  providedIn: 'root'
})
export class Mechanicdetails {

  private apiURL = Environment.authUrl

  constructor( private http: HttpClient) {}

   savemechanicDetails(setupFormValue: any, files: { [key: string]: File | null }): Observable<any> {
  const formData = new FormData();

const mechanic = {

      nationalIdNumber: setupFormValue.nationalIdNumber,
      alternativePhone: setupFormValue.alternativePhone,
      physicalAddress: setupFormValue.physicalAddress,
      emergencyContactName: setupFormValue.emergencyContactName,
      emergencyContactNumber: setupFormValue.emergencyContactNumber,
      yearsOfExperience: setupFormValue.yearsOfExperience,
      areasOfSpecialization: setupFormValue.specializationArea,
      vehicleBrands: setupFormValue.vehiclebrands,
      availability: setupFormValue.availability
    };

formData.append('mechanic', new Blob([JSON.stringify(mechanic)], { type: 'application/json' }),'mechanic.json');

if (files['profilePic']) formData.append('profilePic', files['profilePic']);
if (files['nationalIDPic']) formData.append('nationalIDPic', files['nationalIDPic']);
if (files['professionalCertificate']) formData.append('professionalCertificate', files['professionalCertificate']);
if (files['policeClearanceCertificate']) formData.append('policeClearanceCertificate', files['policeClearanceCertificate']);
if (files['anyRelevantCertificate']) formData.append('anyRelevantCertificate', files['anyRelevantCertificate']);

  return this.http.put(`${this.apiURL}/mechanic/update`, formData);
}
}
