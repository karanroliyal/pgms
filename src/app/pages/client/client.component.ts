import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {ReactiveFormsModule , FormGroup , FormControl} from '@angular/forms'
import { PaginationComponent } from '../../components/pagination/pagination.component';

@Component({
  selector: 'app-client',
  imports: [ReactiveFormsModule , CommonModule , PaginationComponent],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css'
})
export class ClientComponent {

  filterOption : boolean = false

  
  filterForm = new FormGroup({
    name: new FormControl(''),
    email_id: new FormControl(''),
    mobile_no: new FormControl(''),
    status: new FormControl(''),
    limit: new FormControl(15),
    order: new FormControl("DESC"),
    sort_by: new FormControl('id'),
    page: new FormControl(1),
  })



}
