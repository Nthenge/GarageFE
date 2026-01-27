import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-verifications-documents',
  imports: [],
  template: `
    <p>
      Upload your verifications documents
    </p>
  `,
  styles: ``
})
export class VerificationDocuments {
     @Input() form!: FormGroup; 

}
