import { CommonModule } from '@angular/common';
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
  selector: 'app-tenants',
  imports: [ReactiveFormsModule, CommonModule, PaginationComponent, FormValidationMessageComponent, StateNamePipe],

  templateUrl: './tenants.component.html',
  styleUrl: './tenants.component.css'
})
export class TenantsComponent {


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
  editPropertyId: string = ''
  property_data: any
  @ViewChild('modelClose') modelClose!: ElementRef;

  constructor(private api: ApiService, private GF: GlobalService) { }

  ngOnInit(): void {
    this.getTable()
    this.getPropertyData()
  }

  filterForm = new FormGroup({
    id: new FormControl(''),
    action: new FormControl('property'),
    district: new FormControl(''),
    state: new FormControl(''),
    status: new FormControl(''),
    limit: new FormControl(10),
    order: new FormControl("DESC"),
    sort_by: new FormControl('id'),
    page: new FormControl(1),
  })

  propertyForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
    state: new FormControl('', [Validators.required]),
    location: new FormControl(''),
    district: new FormControl('', [Validators.required]),
    status: new FormControl('', Validators.required),
    pincode: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]),
    total_rooms: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]),
    id: new FormControl('')
  })

  filterSearch() {
    this.filterForm.get('page')?.setValue(1)
  }



  
  closepropertyForm() {
    this.modelClose.nativeElement.click()
    this.propertyForm.reset()
    this.getTable()
  }

  openAddpropertyForm() {
    this.propertyForm.reset()
    this.propertyForm.markAsUntouched()
    this.editMode = false;
    this.district_data = []
  }



  getTable() {
    this.api.postApi('property-table', this.filterForm.value).subscribe(
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

  add() {
    this.propertyForm.markAllAsTouched();

    const formData = {
      ...this.propertyForm.value,
    };

    if (this.propertyForm.valid) {
      this.api.postApi('add-pg-property', formData).subscribe(
        (res: any) => {
          if (res.status) {
            this.GF.showToast(res.message, 'success')
            this.closepropertyForm()
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

  edit(clientId: string) {
    this.propertyForm.markAsUntouched()
    this.editMode = true
    this.api.postApi('get-list', { action: 'property', id: clientId }).subscribe(
      (res: any) => {
        if (res.status) {
          this.editPropertyId = res.data.id
          delete res.data['profile']
          delete res.data['password']
          delete res.data['id']
          this.propertyForm.patchValue(res.data);
        
        } else {
          this.GF.showToast(res.message, 'danger')
        }
      },
      (err: any) => {
        this.GF.showToast(err.error.message, 'danger')
      }
    )
  }

    update() {
      this.propertyForm.markAllAsTouched();
  
      const formData = {
        ...this.propertyForm.value,
        id: this.editPropertyId
      };
  
      if (this.propertyForm.valid) {
        this.api.postApi('update-pg-property', formData).subscribe(
          (res: any) => {
            if (res.status) {
              this.GF.showToast(res.message, 'success')
              this.closepropertyForm()
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





  delete(clinetId: string) {
    this.api.postApi('delete', { action: 'property', id: clinetId }).subscribe(
      (res: any) => {
        if (res.status) {
          this.GF.showToast('Client deleted successfully', 'success')
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
