import { StatusAffaire } from "../enums/status-affaire";

export interface AffaireReq {
     titre: string;
      description: string;
      numeroDossier: string;
      dateOuverture: string | Date; 
      statut: StatusAffaire;
      clientId: number;

}
