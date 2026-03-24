import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Client } from '../interfaces/client';
import { Router } from '@angular/router';
const apiUrl=environment.apiUrl+"/users";
@Injectable({
  providedIn: 'root',
})
export class ServiceUser {
  router:Router=inject(Router);
   http:HttpClient=inject (HttpClient);
   constructor() {
    this.autoLoadUser();
  }
private userSubject = new BehaviorSubject<Client | null>(null);
public user$ = this.userSubject.asObservable();
  getMe(): Observable<Client> {
  return this.http.get<Client>(apiUrl + "/me").pipe(
    tap(client => {
      this.userSubject.next(client); 
      console.log('Utilisateur mis en cache dans le service');
    })
  );
  
  }
  getCurrentUser(): Client | null {
  return this.userSubject.value;
}
private autoLoadUser() {
    const token = localStorage.getItem('token');
    if (token) {
      this.getMe().subscribe({
        error: () => this.logout() 
      });
    }
  }
  logout() {
    localStorage.removeItem('token');
    this.userSubject.next(null);
    this.router.navigate(['/home']);

  }





  

  
}
