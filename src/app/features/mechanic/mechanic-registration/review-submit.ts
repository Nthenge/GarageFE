import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-review-submit',
  imports: [],
  template: `
   <h3>Review Your Details</h3>

   <p>Form data preview </p>
   

    <button >Submit</button>
  `,
  styles: ``
})
export class ReviewSubmit {

     @Input() form!: FormGroup; 

}
