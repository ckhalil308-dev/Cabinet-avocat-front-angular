import { Audienceres } from "./audienceres";

export interface DashboardRes {
totalClients: number;
  affairesEnCours: number;
  affairesTerminees: number;
  audiencesCetteSemaine: number;
  audiencesSemaine: Audienceres[];

}
