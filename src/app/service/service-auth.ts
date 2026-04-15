import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import {  LoginInt } from '../interfaces/loginInt';
import { Observable } from 'rxjs';
import { Client } from '../interfaces/client';
import { ClientRegister } from '../interfaces/client-register';
import { Authresponse } from '../interfaces/authresponse';
const apiUrm=environment.apiUrl+"/auth";
@Injectable({
  providedIn: 'root',
})

export class ServiceAuth {
   private readonly http:HttpClient=inject(HttpClient);
   login(user:LoginInt) : Observable<Authresponse>{
       return this.http.post<Authresponse>(apiUrm+"/login",user) 
   }

   

   register(user:ClientRegister) : Observable<Client>{
    return this.http.post<Client>(apiUrm+"/register",user)
   }


   



  
}
