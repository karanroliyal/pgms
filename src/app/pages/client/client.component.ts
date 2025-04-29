import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms'
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { ApiService } from '../../services/api.service';
import { GlobalService } from '../../services/global.service';


// interface table_data {
//   id: string,
//   name: string,
//   email: string,
//   phone: string,
//   status: string,
//   total_records: string,
//   current_page: string,
//   limit: string,
//   total_pages: string
// }


@Component({
  selector: 'app-client',
  imports: [ReactiveFormsModule, CommonModule, PaginationComponent],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css'
})




export class ClientComponent implements OnInit {

  constructor(private api: ApiService, private GF: GlobalService) { }

  ngOnInit(): void {
    this.getTable()
  }

  filterOption: boolean = false
  table_data :  any
  total_records: number = 0
  page: number = 0
  limit: number = 0
  total_pages: number = 0


  filterForm = new FormGroup({
    name: new FormControl(''),
    action: new FormControl('pg_owner'),
    email: new FormControl(''),
    phone: new FormControl(''),
    status: new FormControl(''),
    limit: new FormControl(10),
    order: new FormControl("DESC"),
    sort_by: new FormControl('id'),
    page: new FormControl(1),
  })


  getTable() {
    this.api.postApi('pg-owner-table', this.filterForm.value).subscribe(
      (res: any) => {
        if (res.status) {
          this.limit = res.limit
          this.total_pages = res.total_pages
          this.page = res.page
          this.total_records = res.total_records
          this.table_data = res.data
        } else {
          this.GF.showToast(res.message, 'danger')
        }
      },
      (err: any) => {
        this.GF.showToast(err.error.message, 'danger')
      }
    )
  }

  resetFilterForm(){
    this.filterForm.get('page')?.setValue(1)
    this.GF.preserveField(this.filterForm , ['action' , 'limit' , 'sort'] , null )
    this.filterForm.patchValue({
      status:'',
      email:'',
      limit:10,
      order:'DESC',
      sort_by:'id',
      page:1,
      name:'',
      phone:''
    })
    this.getTable()
  }


  // table shorting 
  sortColumn: string = '';
  sortOrder: 'ASC' | 'DESC' = 'DESC';

  sortingTable(sortOn: string) {
    if (this.sortColumn === sortOn) {
      this.sortOrder = this.sortOrder === 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.sortColumn = sortOn;
      this.sortOrder = 'ASC';
    }
    this.filterForm.controls['order'].setValue(this.sortOrder);
    this.filterForm.controls['sort_by'].setValue(sortOn);
    this.getTable();
  }

}
