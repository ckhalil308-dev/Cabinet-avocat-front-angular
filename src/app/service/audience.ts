import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Audiencereq } from '../interfaces/audiencereq';
import { Audienceres } from '../interfaces/audienceres';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AudienceService {
  private apiUrl = environment.apiUrl+ '/audiences';

  constructor(private http: HttpClient) {}
  createAudience(request: Audiencereq): Observable<Audienceres> {
    return this.http.post<Audienceres>(`${this.apiUrl}/secretaire`, request);
  }
  getAudiencesForCurrentClient(): Observable<Audienceres[]> {
    return this.http.get<Audienceres[]>(`${this.apiUrl}/client/mes-audiences`);
  }
  getAudiencesByAffaire(affaireId: number): Observable<Audienceres[]> {
    return this.http.get<Audienceres[]>(`${this.apiUrl}/secretaire/affaires/${affaireId}`);
  }
    updateAudience(id: number, request: Audiencereq): Observable<Audienceres> {
    return this.http.put<Audienceres>(`${this.apiUrl}/secretaire/${id}`, request);
  }
  deleteAudience(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/secretaire/${id}`);
  }
  postponeAudience(id: number, nouvelleDate: string, motif: string): Observable<Audienceres> {
    const params = new HttpParams()
      .set('nouvelleDate', nouvelleDate)
      .set('motif', motif);
    return this.http.put<Audienceres>(`${this.apiUrl}/secretaire/postpone/${id}/`, null, { params });
  }
}