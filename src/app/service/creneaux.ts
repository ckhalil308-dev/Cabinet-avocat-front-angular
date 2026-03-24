import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { CreneauRequest } from '../interfaces/creneau-request';
import { CreneauResClient } from '../interfaces/creneau-res-client';
import { CreneauResSecretaire } from '../interfaces/creneau-res-secretaire';
import { ApiResponse } from '../interface/api-response';
import { ModifierCreneauDto } from '../interface/modifier-creneau-dto';



const apiUrl = environment.apiUrl + '/creneaux';

@Injectable({
  providedIn: 'root',
})
export class CreneauService {
  private http = inject(HttpClient);

  getDisponiblesPourClient(date: string): Observable<CreneauResClient[]> {
    return this.http.get<CreneauResClient[]>(`${apiUrl}/client/disponible/${date}`);
  }

  getPlanningSemaineClient(dateReference: string): Observable<CreneauResClient[]> {
    const params = new HttpParams().set('dateReference', dateReference);
    return this.http.get<CreneauResClient[]>(`${apiUrl}/client/planning-semaine`, { params });
  }
  getCreneauPourClient(id: number): Observable<CreneauResClient> {
    return this.http.get<CreneauResClient>(`${apiUrl}/client/${id}`);
  }
  genererCreneauxJournaliers(date: string): Observable<ApiResponse> {
    const params = new HttpParams().set('date', date);
    return this.http.post<ApiResponse>(`${apiUrl}/secretaire/journal`, {}, { params });
  }

  getPlanningSemaineSecretaire(dateReference: string): Observable<CreneauResSecretaire[]> {
    const params = new HttpParams().set('dateReference', dateReference);
    return this.http.get<CreneauResSecretaire[]>(`${apiUrl}/secretaire/planning-semaine`, { params });
  }

  getCreneauPourSecretaire(id: number): Observable<CreneauResSecretaire> {
    return this.http.get<CreneauResSecretaire>(`${apiUrl}/secretaire/${id}`);
  }
  bloquerCreneau(id: number, motif?: string): Observable<CreneauResSecretaire> {
    const params = motif ? new HttpParams().set('motif', motif) : undefined;
    return this.http.post<CreneauResSecretaire>(`${apiUrl}/secretaire/${id}/bloquer`, {}, { params });
  }
  creerCreneau(creneau: CreneauRequest): Observable<CreneauResSecretaire> {
    return this.http.post<CreneauResSecretaire>(`${apiUrl}/secretaire`, creneau);
  }

  modifierCreneau(id: number, data: ModifierCreneauDto): Observable<CreneauResSecretaire> {
    return this.http.put<CreneauResSecretaire>(`${apiUrl}/secretaire/${id}`, data);
  }
  supprimerCreneau(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${apiUrl}/secretaire/${id}`);
  }
}
