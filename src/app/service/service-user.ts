import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Client } from '../interfaces/client';
import { Router } from '@angular/router';
import { ApiResponse } from '../interfaces/api-response';
import { ClientRegister } from '../interfaces/client-register';
import { ClientReq } from '../interfaces/client-req';
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
    getClientById(id: number): Observable<Client> {
    return this.http.get<Client>(`${apiUrl}/secretaire/${id}`);
  }

  getAllClients(page: number = 0, size: number = 10): Observable<Client[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<Client[]>(`${apiUrl}/secretaire/all`, { params });
  }
  modifierClient(id: number, clientRequest: ClientReq): Observable<Client> {
    return this.http.put<Client>(
      `${apiUrl}/secretaire/edit/${id}`,
      clientRequest
    );
  }
  supprimerClient(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${apiUrl}/secretaire/del/${id}`);
  }
  verifyClient(id: number): Observable<Client> {
    return this.http.put<Client>(
      `${apiUrl}/secretaire/verify/${id}`,
      {}
    );
  }

  }
  





  

  

