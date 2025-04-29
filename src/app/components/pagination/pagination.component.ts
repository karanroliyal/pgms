import { Component, Input, input } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  imports: [ReactiveFormsModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {

  formGroup = input<FormGroup>();
  limit = input<number>();
  page_no = input<number>(0);
  total_pages = input<number>(0);
  @Input() public callback: Function | undefined;


  setLimit(limit: string) {
    this.formGroup()?.controls['limit'].setValue(limit);
    this.callback?.();
  }


  next() {
    if (this.total_pages() > this.page_no()) {
      this.formGroup()?.controls['page'].setValue(this.page_no() + 1);
      this.callback?.();
    }
  }

  previous() {
    if (this.page_no() > 1) {
      this.formGroup()?.controls['page'].setValue(this.page_no() - 1);
      this.callback?.();
    }
  }

  first() {
    this.formGroup()?.controls['page'].setValue(1);
    this.callback?.();
  }

  last() {
    this.formGroup()?.controls['page'].setValue(this.total_pages());
    this.callback?.();
  }


}
