import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { AffaireReq } from '../interfaces/affaire-req';
import { AffaireRes } from '../interfaces/affaire-res';
import { StatusAffaire } from '../enums/status-affaire';

const apiUrl = environment.apiUrl + '/affaires';

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root',
})
export class AffaireService {
  constructor(private http: HttpClient) {}
  createAffaire(affaireRequest: AffaireReq): Observable<AffaireRes> {
    return this.http.post<AffaireRes>(
      `${apiUrl}/secretaire/creer`,
      affaireRequest
    );
  }
  getMyAffaires(): Observable<AffaireRes[]> {
    return this.http.get<AffaireRes[]>(`${apiUrl}/client/mine`);
  }
  getAffairesByClientId(clientId: number): Observable<AffaireRes[]> {
    return this.http.get<AffaireRes[]>(
      `${apiUrl}/secretaire/affaire/${clientId}`
    );
  }
  getAllAffaires(
    statut?: StatusAffaire,
    page: number = 0,
    size: number = 10
  ): Observable<PageResponse<AffaireRes>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (statut) {
      params = params.set('statut', statut);
    }

    return this.http.get<PageResponse<AffaireRes>>(
      `${apiUrl}/secretaire`,
      { params }
    );
  }
  getAffaireById(id: number): Observable<AffaireRes> {
    return this.http.get<AffaireRes>(`${apiUrl}/secretaire/${id}`);
  }
  updateAffaire(id: number, affaireRequest: AffaireReq): Observable<AffaireRes> {
    return this.http.put<AffaireRes>(
      `${apiUrl}/secretaire/${id}`,
      affaireRequest
    );
  }
  deleteAffaire(id: number): Observable<void> {
    return this.http.delete<void>(`${apiUrl}/secretaire/${id}`);
  }
}