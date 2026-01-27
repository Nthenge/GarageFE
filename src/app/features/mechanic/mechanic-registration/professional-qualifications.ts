import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-professional-qualifications',
  imports: [],
  template: `
    <p>
      Fill in your professional qualifications
    </p>
  `,
  styles: ``
})
export class ProfessionalQualifications {
     @Input() form!: FormGroup; 

}
