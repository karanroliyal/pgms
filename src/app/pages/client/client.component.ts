import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms'
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { ApiService } from '../../services/api.service';
import { GlobalService } from '../../services/global.service';
import { FormValidationMessageComponent } from '../../components/form-validation-message/form-validation-message.component';

interface state{
  state_id : string,
  state_name : string
}
interface district{
  district_id : string,
  district_name : string
}



@Component({
  selector: 'app-client',
  imports: [ReactiveFormsModule, CommonModule, PaginationComponent,FormValidationMessageComponent],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css'
})




export class ClientComponent implements OnInit {

  filterOption: boolean = false
  table_data: any
  total_records: number = 0
  page: number = 0
  limit: number = 0
  total_pages: number = 0
  state_data:  state[] |any
  district_data:  district[] |any
  editMode: boolean = false
  editClientId: string = ''
  @ViewChild('modelClose') modelClose!: ElementRef;

  constructor(private api: ApiService, private GF: GlobalService) { }

  ngOnInit(): void {
    this.getTable()
    this.getState()
  }

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
    pincode: new FormControl('' , [Validators.required , Validators.minLength(6) , Validators.maxLength(6)]),
    id: new FormControl('')
  })

  filterSearch(){
    this.filterForm.get('page')?.setValue(1)
  }

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
    this.clientForm.markAllAsTouched();

    const formData = {
      ...this.clientForm.value,
      profile: this.ownerProfile
    };

    if (this.clientForm.valid) {
      this.api.postApi('add-pg-owner' , formData).subscribe(
        (res:any)=>{
          if(res.status){
            this.GF.showToast(res.message , 'success')
            this.closeClientForm()
            this.getTable()
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

  getState(){
    this.clientForm.get('district')?.setValue('')
    this.api.getState().subscribe(
      (res:any)=>{
          this.state_data = res.state
      },
      (err:any)=>{
        this.GF.showToast(err.error.message , 'danger')
      }
    )
    
  }

  getDistrict(state_id:string){
    this.district_data = []
    this.clientForm.get('district')?.setValue('')
    this.api.getState().subscribe(
      (res:any)=>{
          this.district_data = res.district.filter((ele:any)=>{ return ele.state_id == state_id})
      },
      (err:any)=>{
        this.GF.showToast(err.error.message , 'danger')
      }
    )
  }

  // In your component class
  ownerProfile: any;

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

  deleteClient(clinetId:string){
    this.api.postApi('delete' , {action:'pg_owner' , id:clinetId}).subscribe(
      (res:any)=>{
        if(res.status){
          this.GF.showToast('Client deleted successfully' , 'success')
          this.getTable()
        }else{
          this.GF.showToast(res.message , 'danger')
        }
      },
      (err:any)=>{
        this.GF.showToast(err.error.message , 'danger')
      }
    )
  }

  editClient(clientId:string){
    this.clientForm.markAsUntouched()
    this.editMode = true
    this.ownerProfile = ''
    this.api.postApi('get-list' , {action:'pg_owner' , id:clientId}).subscribe(
      (res:any)=>{
        if(res.status){
          this.editClientId = res.data.id
          delete res.data['profile']
          delete res.data['password']
          delete res.data['id']
          this.clientForm.patchValue(res.data);
          setTimeout(()=>{
            this.getDistrict(res.data.state)
            this.clientForm.get('district')?.setValue(res.data.district)
          },200)
        }else{
          this.GF.showToast(res.message , 'danger')
        }
      },
      (err:any)=>{
        this.GF.showToast(err.error.message , 'danger')
      }
    )
  }

  updateClient(){
    
    // setting password validation 
    const passwordControl = this.clientForm.get('password');
    passwordControl?.setValidators([Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).+$'), Validators.minLength(8), Validators.maxLength(15)]);
    passwordControl?.updateValueAndValidity();
    // setting profile validation 
    const profileControl = this.clientForm.get('profile');
    profileControl?.clearValidators();  
    profileControl?.updateValueAndValidity(); 


    this.clientForm.markAllAsTouched();

    const formData = {
      ...this.clientForm.value,
      profile: this.ownerProfile,
      id: this.editClientId
    };

    if(this.clientForm.valid){
      this.api.postApi('update-pg-owner' , formData ).subscribe(
        (res:any)=>{
          if(res.status){
            this.GF.showToast(res.message , 'success')
            this.closeClientForm()
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

  closeClientForm(){
    this.modelClose.nativeElement.click()
    this.clientForm.reset()
  }

  openAddClientForm(){
    this.clientForm.reset()
    this.clientForm.markAsUntouched()
    this.editMode = false;
    this.district_data = []
  }

}
