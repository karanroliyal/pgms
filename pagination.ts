import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination-and-limit',
  imports: [CommonModule],
  templateUrl: './pagination-and-limit.component.html',
  styleUrl: './pagination-and-limit.component.css'
})
export class PaginationAndLimitComponent {

  @Input() total_items = 0;
  @Input() current_page = 1;
  @Input() limit = 10;
  @Input() limitOptions = [1 , 2, 10 , 50 , 100 , 500];

  @Output() pageChange = new EventEmitter<number>();
  @Output() limitChange = new EventEmitter<number>();

  get total_pages(): number {
    return Math.ceil(this.total_items / this.limit);
  }

  changeLimit(newLimit: number) {
    this.limitChange.emit(newLimit);
    // this.pageChange.emit(1); 
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.total_pages) {
      this.pageChange.emit(page);
    }
  }

  firstPage() {
    if (this.current_page > 1) {
      this.pageChange.emit(1);
    }
  }

  lastPage() {
    if (this.current_page < this.total_pages) {
      this.pageChange.emit(this.total_pages);
    }
  }

  nextPage() {
    if (this.current_page < this.total_pages) {
      this.pageChange.emit(this.current_page + 1);
    }
  }

  previousPage() {
    if (this.current_page > 1) {
      this.pageChange.emit(this.current_page - 1);
    }
  }


}
