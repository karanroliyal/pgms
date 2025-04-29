import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms'
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { ApiService } from '../../services/api.service';
import { GlobalService } from '../../services/global.service';
import { FormValidationMessageComponent } from '../../components/form-validation-message/form-validation-message.component';





@Component({
  selector: 'app-client',
  imports: [ReactiveFormsModule, CommonModule, PaginationComponent,FormValidationMessageComponent],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css'
})




export class ClientComponent implements OnInit {

  constructor(private api: ApiService, private GF: GlobalService) { }

  ngOnInit(): void {
    this.getTable()
  }

  filterOption: boolean = false
  table_data: any
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

  clientForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
    email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(50)]),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.maxLength(10), Validators.minLength(10)]),
    state: new FormControl('', [Validators.required]),
    district: new FormControl('', [Validators.required]),
    status: new FormControl('', Validators.required),
    profile: new FormControl('', Validators.required),
    address: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required,Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).+$'), Validators.minLength(8), Validators.maxLength(15)]),
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

  resetFilterForm() {
    this.filterForm.get('page')?.setValue(1)
    this.GF.preserveField(this.filterForm, ['action', 'limit', 'sort'], null)
    this.filterForm.patchValue({
      status: '',
      email: '',
      limit: 10,
      order: 'DESC',
      sort_by: 'id',
      page: 1,
      name: '',
      phone: ''
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

  addClient() {
    // Make password required
    const passwordControl = this.clientForm.get('password');
    passwordControl?.setValidators([Validators.required]);
    passwordControl?.updateValueAndValidity();
    this.clientForm.markAllAsTouched()
    // if (this.clientForm.valid) {
      this.api.postApi('add-pg-owner' , this.clientForm.value).subscribe(
        (res:any)=>{
          if(res.status){
            this.GF.showToast(res.message , 'success')
          }else{
            this.GF.showToast(res.message , 'danger')
          }
        },
        (err:any)=>{
          this.GF.showToast(err.error.message , 'danger')
        }
      )
    // }
  }

}
