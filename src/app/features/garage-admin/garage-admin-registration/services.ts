import { CommonModule } from '@angular/common';
import { Component,Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-services',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <div [formGroup]="group">
<div class="form-label">
    <label>Service Categories</label>
  <input formControlName="serviceCategories">
</div>

  <div class="form-label">
    <label> Specialised Services</label>
  <input formControlName="specialised Services">
</div>
  `,

  styles:[`

    .form-label{
      display: flex;
      flex-direction: columns;
      margin-bottom: 10px;
    }

    .form-label-label{
      font-weight: 400;
      margin-bottom: 5px;
    }

    .form-label input{
      padding: 8px;
      border: 1px solid #0e0d0dff;
      border-radius: 4px
    }



    `]
 
})
export class Services{
  @Input() group! : FormGroup<any>

  



}
