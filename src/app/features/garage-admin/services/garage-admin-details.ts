import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BusinessInfo {
  businessName: string;
  businessRegNumber: string;
  businessLicenseNumber: string;
  physicalBusinessAddress: string;
  businessEmailAddress: string;
}

export interface OperationalInfo {
  yearsInOperation: string;
  operatingHours: string;
  twentyFourHours: string;
}

export interface ServicesInfo {
  serviceCategories: string;
  specialisedServices?: string;
}

export interface FinancialInfo {
  mpesaPayBill?: string;
  mpesaTill?: string;
}

export interface DocumentsInfo {
  businessLicense: File | null;
  professionalCertificate?: File | null;
  facilityPhotos?: File | null;
}

export interface GarageAdminDetails {
  business: BusinessInfo;
  operational: OperationalInfo;
  services: ServicesInfo;
  financial: FinancialInfo;
  documents: DocumentsInfo;
  review?: {review:string};
}



@Injectable({
  providedIn: 'root'
})
export class GarageAdminDetails {
  private apiURL= 'htyr/fgt'

  constructor(private http: HttpClient){}

  saveGarageAdminDetails(formValue: GarageAdminDetails): Observable<any>{
    const formData = new FormData()

  
    // Append nested fields
    formData.append('business', JSON.stringify(formValue.business));
    formData.append('operational', JSON.stringify(formValue.operational));
    formData.append('services', JSON.stringify(formValue.services));
    formData.append('financial', JSON.stringify(formValue.financial));

    // Append files

    if (formValue.documents.businessLicense) {
      formData.append('businessLicense', formValue.documents.businessLicense);
    }  

    if (formValue.documents.professionalCertificate) {
      formData.append('professionalCertificate', formValue.documents.professionalCertificate);
    }
    if (formValue.documents.facilityPhotos) {
      formData.append('facilityPhotos', formValue.documents.facilityPhotos);
    }

    // Optional review
    if (formValue.review?.review) {
      formData.append('review', formValue.review.review);
    }

    return this.http.post(`${this.apiURL}/garage-admin/details`, formData);
  }

  getGarageAdminDetails(): Observable<GarageAdminDetails> {
    return this.http.get<GarageAdminDetails>(`${this.apiURL}/garage-admin/details`);
  }
  
}
