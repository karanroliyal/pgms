import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment.development'

const server_url = environment.apiUrl

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }


  postApi(url:string , data:any){
    return this.http.post( server_url+url , data)
  }
  getApi(url:string , data:any){
    return this.http.get(server_url+url)
  }

  getState(){
    return this.http.get('assets/data/state_district.json')
  }

}
