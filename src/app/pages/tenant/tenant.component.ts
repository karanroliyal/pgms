import { CommonModule, DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms'
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { ApiService } from '../../services/api.service';
import { GlobalService } from '../../services/global.service';
import { FormValidationMessageComponent } from '../../components/form-validation-message/form-validation-message.component';
import { StateNamePipe } from '../../pipes/state-name.pipe';

interface state {
  state_id: string,
  state_name: string
}
interface district {
  district_id: string,
  district_name: string
}

@Component({
  selector: 'app-tenant',
  imports: [ReactiveFormsModule, CommonModule, PaginationComponent, FormValidationMessageComponent, StateNamePipe, DatePipe],
  templateUrl: './tenant.component.html',
  styleUrl: './tenant.component.css'
})
export class TenantComponent {

  
    filterOption: boolean = false
    table_data: any
    total_records: number = 0
    page: number = 0
    limit: number = 0
    total_pages: number = 0
    state_district_data : any
    state_data: state[] | any
    district_data: district[] | any
    districtViewData: district[] | any
    editMode: boolean = false
    EDITId: string = ''
    property_data: any
    @ViewChild('modelClose') modelClose!: ElementRef;
  
    constructor(private api: ApiService, private GF: GlobalService) { }
  
    ngOnInit(): void {
      this.getTable()
      this.getState()
      this.getPropertyData()
    }


  
    filterForm = new FormGroup({
      pg_id: new FormControl(''),
      action: new FormControl('tenants'),
      district: new FormControl(''),
      state: new FormControl(''),
      status: new FormControl(''),
      limit: new FormControl(10),
      order: new FormControl("DESC"),
      sort_by: new FormControl('id'),
      page: new FormControl(1),
      name: new FormControl(''),
      email: new FormControl(''),
      address: new FormControl(''),
      dob: new FormControl(''),
      room_number: new FormControl(''),
      occupation: new FormControl(''),
      phone: new FormControl(''),
      emergency_contact: new FormControl(''),
      parent_contact: new FormControl(''),
    })


    resetFilterForm() {
      this.filterForm.get('page')?.setValue(1)
      this.GF.preserveField(this.filterForm, ['action', 'limit', 'sort'], null)
      this.filterForm.patchValue({
        status: '',
        state: '',
        limit: 10,
        order: 'DESC',
        sort_by: 'id',
        page: 1,
        pg_id: '',
        district: '',
        name:'',
        email:'',
        address:'',
        dob:'',
        room_number:'',
        occupation:'',
        phone:'',
        emergency_contact:'',
        parent_contact:'',
      })
      this.getTable()
    }
  
  
    dataForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
      room_id: new FormControl('',[Validators.required , Validators.pattern(/^[0-9]+$/)]),
      phone: new FormControl('' , [Validators.required , Validators.maxLength(10) , Validators.minLength(10), Validators.pattern(/^[0-9]+$/)]),
      email: new FormControl('' , [Validators.required , Validators.email , Validators.maxLength(50), Validators.minLength(3)]),
      parent_contact: new FormControl('' , [Validators.required , Validators.maxLength(10) , Validators.minLength(10) , Validators.pattern(/^[0-9]+$/)]),
      emergency_contact: new FormControl('' , [Validators.required , Validators.maxLength(10) , Validators.minLength(10) , Validators.pattern(/^[0-9]+$/)]),
      password: new FormControl('', [Validators.required,Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).+$'), Validators.minLength(8), Validators.maxLength(15)]),
      gender: new FormControl('', [Validators.required , Validators.pattern(/^(male|femail|other)$/)]),
      dob: new FormControl('' , [Validators.required]),
      occupation: new FormControl('' , [Validators.required , Validators.minLength(3) , Validators.maxLength(70)]),
      check_in_date: new FormControl('' , [Validators.required ]),
      rent_status: new FormControl('' , [Validators.required, Validators.pattern(/^(pending|paid)$/) ]),
      state: new FormControl('', [Validators.required ]),
      location: new FormControl(''),
      district: new FormControl('', [Validators.required]),
      status: new FormControl('', Validators.required),
      pincode: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]),
      total_rooms: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]),
      id: new FormControl(''),
      pg_id: new FormControl('', [Validators.required])
    })
  
    filterSearch() {
      this.filterForm.get('page')?.setValue(1)
    }
  
    getTable() {
      this.api.postApi('tenant-table', this.filterForm.value).subscribe(
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
  
    ADD() {
      this.dataForm.markAllAsTouched();
  
      const formData = {
        ...this.dataForm.value,
      };
  
      if (this.dataForm.valid) {
        this.api.postApi('add-pg-property', formData).subscribe(
          (res: any) => {
            if (res.status) {
              this.GF.showToast(res.message, 'success')
              this.closedataForm()
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
  
    getState() {
      
      this.api.getState().subscribe(
        (res: any) => {
          this.state_district_data = res
          this.state_data = this.state_district_data.state
        },
        (err: any) => {
          this.GF.showToast(err.error.message, 'danger')
        }
      )
  
    }
  
    getDistrictForView(district_id:string):string{
          return this.state_district_data.district.filter((ele: any) => { return ele.district_id == district_id})[0].district_name
    }
  
    getDistrict(state_id: string) {
      this.dataForm.get('district')?.setValue('')
      this.filterForm.get('district')?.setValue('')
          this.district_data = this.state_district_data.district.filter((ele: any) => { return ele.state_id == state_id })
    }
  
    DELETE(clinetId: string) {
      this.api.postApi('delete', { action: 'property', id: clinetId }).subscribe(
        (res: any) => {
          if (res.status) {
            this.GF.showToast('Tenant deleted successfully', 'success')
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
  
    EDIT(clientId: string) {
      this.dataForm.markAsUntouched()
      this.editMode = true
      this.api.postApi('get-list', { action: 'property', id: clientId }).subscribe(
        (res: any) => {
          if (res.status) {
            this.EDITId = res.data.id
            delete res.data['profile']
            delete res.data['password']
            delete res.data['id']
            this.dataForm.patchValue(res.data);
            setTimeout(() => {
              this.getDistrict(res.data.state)
              this.dataForm.get('district')?.setValue(res.data.district)
            }, 200)
          } else {
            this.GF.showToast(res.message, 'danger')
          }
        },
        (err: any) => {
          this.GF.showToast(err.error.message, 'danger')
        }
      )
    }
  
    UPDATE() {
      this.dataForm.markAllAsTouched();
  
      const formData = {
        ...this.dataForm.value,
        id: this.EDITId
      };
  
      if (this.dataForm.valid) {
        this.api.postApi('update-pg-property', formData).subscribe(
          (res: any) => {
            if (res.status) {
              this.GF.showToast(res.message, 'success')
              this.closedataForm()
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
  
    closedataForm() {
      this.modelClose.nativeElement.click()
      this.dataForm.reset()
      this.getTable()
    }
  
    openADDForm() {
      this.dataForm.reset()
      this.dataForm.markAsUntouched()
      this.editMode = false;
      this.district_data = []
    }
  
    
    getPropertyData(){
  
      this.api.postApi('property-data' , {}).subscribe(
        (res:any)=>{
          if(res.status){
            this.property_data = res.data
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
