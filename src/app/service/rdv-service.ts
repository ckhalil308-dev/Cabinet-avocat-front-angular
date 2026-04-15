import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RdvRes } from '../interfaces/rdv-res';
import { RdvReq } from '../interfaces/rdv-req';
import { environment } from '../../environments/environment.development';
import { StatusRdv } from '../enums/status-rdv';

const apiUrl = environment.apiUrl + '/rdv';



@Injectable({
  providedIn: 'root',
})
export class RdvService {

  constructor(private http: HttpClient) {}

  proposerRdv(req: RdvReq): Observable<RdvRes> {
    return this.http.post<RdvRes>(`${apiUrl}/client/proposer`, req);
  }
  confirmerRdv(id: number): Observable<RdvRes> {
    return this.http.put<RdvRes>(`${apiUrl}/secretaire/${id}/confirmer`, null);
  }
  annulerRdv(id: number, motifRefus: string): Observable<RdvRes> {
    const params = new HttpParams().set('motifRefus', motifRefus);
    return this.http.put<RdvRes>(`${apiUrl}/secretaire/${id}/annuler`, null, { params });
  }

  getRdvsPourSecretaire(status: StatusRdv): Observable<RdvRes[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<RdvRes[]>(`${apiUrl}/secretaire`, { params });
  }

  getRdvsPourClient(status: StatusRdv): Observable<RdvRes[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<RdvRes[]>(`${apiUrl}/client`, { params });
  }
}
