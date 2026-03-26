import { StatusAffaire } from "../enums/status-affaire";

export interface AffaireRes {   
  id: number;
  clientNom: string;
  clientPrenom: string;
  titre: string;
  description: string;
  numeroDossier: string;
  dateOuverture: string | Date; 
  statut: StatusAffaire;
  clientId: number;
  audienceIds: number[];
  documentIds: number[];
}
