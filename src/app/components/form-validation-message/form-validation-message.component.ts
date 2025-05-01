import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-validation-message',
  imports: [],
  templateUrl: './form-validation-message.component.html',
})
export class FormValidationMessageComponent {

@Input() formGroup!: |FormGroup;
@Input() controlName!:string;
@Input() fieldName:string='';

get control() {
  return this.formGroup?.get(this.controlName);
}


}
