import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment } from '../../../../environment/environment';

export interface MechanicPersonalInfo {
  profilePic?: File | null; // optional since not everyone uploads
  nationalIdNumber: string;
  alternativePhone?: string;
  physicalAddress: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
}

export interface MechanicProfessionalInfo {
  yearsOfExperience: number;
  areasOfSpecialization: string;
  bio: string;
}

export interface MechanicSkills {
  vehicleBrands: string;
  garageLinked: string;
  availability: string;
}

export interface MechanicDocuments {
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

// export interface MechanicFormValue{

// }


@Injectable({
  providedIn: 'root'
})
export class Mechanicdetails {

  private apiURL = Environment.authUrl

  constructor( private http: HttpClient) {}

   savemechanicDetails(setupFormValue: any, files: { [key: string]: File | null }): Observable<any> {
  const formData = new FormData();

  // Flatten into one object 

const mechanic = {

      nationalIdNumber: setupFormValue.nationalIdNumber,
      alternativePhone: setupFormValue.alternativePhone,
      physicalAddress: setupFormValue.physicalAddress,
      emergencyContactName: setupFormValue.emergencyContactName,
      emergencyContactNumber: setupFormValue.emergencyContactNumber,
      yearsOfExperience: setupFormValue.yearsOfExperience,
      areasOfSpecialization: setupFormValue.specializationArea,
      //bio: setupFormValue.bio || '',
      vehicleBrands: setupFormValue.vehiclebrands,
      garageLinked: setupFormValue.garageId,
      //availability: setupFormValue.availability || ''
    };

//Append JSON named mechanic
formData.append('mechanic', new Blob([JSON.stringify(mechanic)], { type: 'application/json' }),'mechanic.json');

if (files['profilePic']) formData.append('profilePic', files['profilePic']);
if (files['nationalIDPic']) formData.append('nationalIDPic', files['nationalIDPic']);
if (files['professionalCertificate']) formData.append('professionalCertificate', files['professionalCertificate']);
// if (files['policeClearanceCertificate']) formData.append('policeClearanceCertificate', files['policeClearanceCertificate']);
if (files['anyRelevantCertificate']) formData.append('anyRelevantCertificate', files['anyRelevantCertificate']);

  return this.http.post(`${this.apiURL}/mechanic/create`, formData);
}
    
    //formValue: MechanicRegistrationData): Observable<any>{
  //   const formData = new FormData()

  //   if (formValue.personal.profilePic){
  //     formData.append('profillePic', formValue.personal.profilePic);
  //   }

  //     formData.append('personal', JSON.stringify(formValue.personal));
  //     formData.append('professional', JSON.stringify(formValue.professional));
  //     formData.append('skills', JSON.stringify(formValue.skills));
  //     formData.append('documents', JSON.stringify(formValue.documents));

  // return this.http.post(`${this.apiURL}/mechanics/details`, formData);

  // }

  
  
}
