import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PaginationComponent } from '../../components/pagination/pagination.component';

@Component({
  selector: 'app-complaints',
  imports: [CommonModule , PaginationComponent],
  templateUrl: './complaints.component.html',
  styleUrl: './complaints.component.css'
})
export class ComplaintsComponent {

  table_data:any

  getActiveComplaint(){



  }

}
