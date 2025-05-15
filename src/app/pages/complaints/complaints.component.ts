import { CommonModule, DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { GlobalService } from '../../services/global.service';
import { FormValidationMessageComponent } from '../../components/form-validation-message/form-validation-message.component';

@Component({
  selector: 'app-complaints',
  imports: [CommonModule, PaginationComponent, ReactiveFormsModule, FormValidationMessageComponent, DatePipe],
  templateUrl: './complaints.component.html',
  styleUrl: './complaints.component.css'
})
export class ComplaintsComponent implements OnInit {

  filterOption: boolean = false
  editMode: boolean = false
  table_data: any
  total_records: number = 0
  page: number = 0
  limit: number = 0
  total_pages: number = 0
  editId: string = ''
  @ViewChild('modelClose') modelClose!: ElementRef;

  constructor(private api: ApiService, private GF: GlobalService) { }


  ngOnInit(): void {
    this.getTable()
  }


  filterForm = new FormGroup({
    description: new FormControl(''),
    action: new FormControl('tenant_complaint'),
    status: new FormControl(''),
    limit: new FormControl(10),
    order: new FormControl("DESC"),
    sort_by: new FormControl('id'),
    page: new FormControl(1),
  })

  myForm = new FormGroup({
    description: new FormControl('', [Validators.required, Validators.maxLength(300), Validators.minLength(3)]),
    category: new FormControl('', [Validators.required]),
    // category: new FormControl('', [Validators.required, Validators.pattern(/^(Food|Water|Wi-Fi|Electricity|Other')$/)]),
    status: new FormControl('', [Validators.pattern(/^(pending|in-progress|resolved)$/)]),
    image: new FormControl('')
  })

  resetFilterForm() {
    this.filterForm.get('page')?.setValue(1)
    this.GF.preserveField(this.filterForm, ['action', 'limit', 'sort'], null)
    this.filterForm.patchValue({
      status: '',
      limit: 10,
      order: 'DESC',
      sort_by: 'id',
      page: 1,
      description:''
    })
    this.getTable()
  }

  getTable() {
    this.api.postApi('tenant-complaint-table', this.filterForm.value).subscribe(
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

  OpenAddForm() {
    this.myForm.reset()
    this.myForm.markAsUntouched()
    this.editMode = false;
  }

  add() {
    this.myForm.markAllAsTouched();

    const formData = {
      ...this.myForm.value,
      image: this.Attachment
    };

    if (this.myForm.valid) {
      this.api.postApi('add-complaint', formData).subscribe(
        (res: any) => {
          if (res.status) {
            this.GF.showToast(res.message, 'success')
            this.closeForm()
            this.getTable()
          } else {
            this.GF.showToast(res.message, 'danger')
          }
        },
        (err: any) => {
          this.GF.showToast(err.error.message, 'danger')
        }
      )
    }

  }

  closeForm() {
    this.modelClose.nativeElement.click()
    this.myForm.reset()
    this.getTable()
  }

  UPDATE() {
    this.myForm.markAllAsTouched();
    const formData = {
      ...this.myForm.value,
      image: this.Attachment,
      id: this.editId
    };
    if(this.myForm.valid){
      this.api.postApi('update-complaint' , formData ).subscribe(
        (res:any)=>{
          if(res.status){
            this.GF.showToast(res.message , 'success')
            this.closeForm()
          }else{
            this.GF.showToast(res.message , 'danger')
          }
        },
        (err:any)=>{
          this.GF.showToast(err.error.message , 'danger')
        }
      )
    }
  }

   EDIT(clientId:string){
    this.myForm.markAsUntouched()
    this.editMode = true
    this.Attachment = ''
    this.api.postApi('get-list' , {action:'tenant_complaint' , id:clientId}).subscribe(
      (res:any)=>{
        if(res.status){
          this.editId = res.data.id
          delete res.data['image']
          delete res.data['password']
          delete res.data['id']
          this.myForm.patchValue(res.data);
        }else{
          this.GF.showToast(res.message , 'danger')
        }
      },
      (err:any)=>{
        this.GF.showToast(err.error.message , 'danger')
      }
    )
  }


  // In your component class
  Attachment: any;

  fileUpload(event: any, fieldName: string) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Convert file to base64
      reader.onload = () => {
        (this as any)[fieldName] = reader.result; // Dynamically assign to correct variable
      };
    }
  }

}
