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
  selector: 'app-rooms',
  imports: [ReactiveFormsModule, CommonModule, PaginationComponent, FormValidationMessageComponent, StateNamePipe],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.css'
})
export class RoomsComponent {

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
  editRoomId: string = ''
  property_data: any
  @ViewChild('modelClose') modelClose!: ElementRef;

  constructor(private api: ApiService, private GF: GlobalService) { }

  ngOnInit(): void {
    this.getTable()
    this.getPropertyData()
  }

  filterForm = new FormGroup({
    pg_name: new FormControl(''),
    action: new FormControl('rooms'),
    status: new FormControl(''),
    limit: new FormControl(10),
    order: new FormControl("DESC"),
    sort_by: new FormControl('id'),
    page: new FormControl(1),
    room_number: new FormControl(''),
    type: new FormControl('')
  })

  roomForm = new FormGroup({
    room_number: new FormControl('', [Validators.required, Validators.maxLength(10)]),
    type: new FormControl('1', [Validators.required , Validators.pattern(/^[0-9]+$/)]),
    property_id: new FormControl('', [Validators.required , Validators.pattern(/^[0-9]+$/)]),
    status: new FormControl('', Validators.required),
    id: new FormControl('')
  })

  filterSearch() {
    this.filterForm.get('page')?.setValue(1)
  }

  getTable() {
    this.api.postApi('room-table', this.filterForm.value).subscribe(
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
      limit: 10,
      order: 'DESC',
      sort_by: 'id',
      page: 1,
      pg_name: '',
      room_number: '',
      type: ''
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

  addRoom() {
    this.roomForm.markAllAsTouched();

    const formData = {
      ...this.roomForm.value,
    };

    if (this.roomForm.valid) {
      this.api.postApi('add-pg-room', formData).subscribe(
        (res: any) => {
          if (res.status) {
            this.GF.showToast(res.message, 'success')
            this.closeroomForm()
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



  deleteRoom(clinetId: string) {
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

  editRoom(clientId: string) {
    this.roomForm.markAsUntouched()
    this.editMode = true
    this.api.postApi('get-list', { action: 'room', id: clientId }).subscribe(
      (res: any) => {
        if (res.status) {
          this.editRoomId = res.data.id
          delete res.data['id']
          this.roomForm.patchValue(res.data);
        } else {
          this.GF.showToast(res.message, 'danger')
        }
      },
      (err: any) => {
        this.GF.showToast(err.error.message, 'danger')
      }
    )
  }

  updateProperty() {
    this.roomForm.markAllAsTouched();

    const formData = {
      ...this.roomForm.value,
      id: this.editRoomId
    };

    if (this.roomForm.valid) {
      this.api.postApi('update-pg-room', formData).subscribe(
        (res: any) => {
          if (res.status) {
            this.GF.showToast(res.message, 'success')
            this.closeroomForm()
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

  closeroomForm() {
    this.modelClose.nativeElement.click()
    this.roomForm.reset()
    this.getTable()
  }

  openaddRoomForm() {
    this.roomForm.reset()
    this.roomForm.markAsUntouched()
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
