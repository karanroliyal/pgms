import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor() { }

   // comon toast 
   showToast(
    message: string,
    type: 'success' | 'danger' | 'info' | 'warning' = 'info'
  ) {
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white border-0 show position-fixed bottom-0 end-0 m-3 bg-${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.style.zIndex = '9999';
    toast.style.minHeight = '30px';
    toast.style.fontSize = '1rem';
    toast.style.padding = '0.20rem';

    toast.innerHTML = `
      <div class="d-flex align-items-center" style="width: 100%;">
        <div class="toast-body">
          ${message}
        </div>
        <button 
          type="button" 
          class="btn-close btn-close-white me-2 m-auto" 
          data-bs-dismiss="toast" 
          aria-label="Close">
        </button>
      </div>
    `;

    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }



  preserveField(formGroup: FormGroup, dontReset: string[], imageRemoveFunction: Function | null, RemoveCloneFunction?: Function) {
    const preservedValues: { [key: string]: any } = {};
    dontReset.forEach((controlName) => {
      preservedValues[controlName] = formGroup.get(controlName)?.value;
    });
    formGroup.reset(preservedValues);
    if (imageRemoveFunction !== null) {
      imageRemoveFunction();
    }
  }
}
