import { StatusRdv } from "../enums/status-rdv";

export interface RdvRes {
    id: number;
  motif: string;
  message: string;
  status: StatusRdv;
  dateCreation: string; // ISO LocalDateTime
  clientId: number;
  clientNom: string;
  clientPrenom: string;
  creneauId: number;
  creneauDateJour: string; // ISO LocalDate
  creneauHeureDebut: string; // ISO LocalTime
  creneauHeureFin: string; // ISO LocalTime
  creneauReserve: boolean;
  creneauTitre: string;
}
