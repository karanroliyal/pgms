import { Component, Input, OnDestroy } from '@angular/core';
import { GlobalFunctionService } from '../../Services/service/global-function.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sorting',
  imports: [CommonModule],
  templateUrl: './sorting.component.html',
  styles: ''
})
export class SortingComponent implements OnDestroy {

  constructor(public global : GlobalFunctionService){}

  @Input() column_name :string = ''

  ngOnDestroy(): void {
    this.global.sort_column = ""
  }

}
