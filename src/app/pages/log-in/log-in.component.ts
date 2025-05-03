import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { GlobalService } from '../../services/global.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-in',
  imports: [ReactiveFormsModule],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css'
})
export class LogInComponent {

  loginForm: FormGroup;

  constructor(private api:ApiService , private GF : GlobalService , private router:Router) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid){
      this.api.postApi('pg-owner-login',this.loginForm.value).subscribe({
        next:(res:any)=>{
          if(res.status){
            localStorage.setItem('token',res.token)
            this.GF.showToast(res.message , 'success')
            this.router.navigate(['/dashboard'])
          }else{
            this.GF.showToast(res.message , 'danger')
          }
        },
        error:(err:any)=>{
          this.GF.showToast(err.error.message , 'danger')
        }
      }
       
      )

    }
  }

}
