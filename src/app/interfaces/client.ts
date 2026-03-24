import { Role } from "../enums/role.enum";

export interface Client {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    numTelephone: string;
    role: Role;
}
