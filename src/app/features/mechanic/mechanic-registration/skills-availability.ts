import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-skills-availability',
  imports: [],
  template: `
    <p>
      Update the skills section
    </p>
  `,
  styles: ``
})
export class SkillsAvailability {
     @Input() form!: FormGroup; 

}
