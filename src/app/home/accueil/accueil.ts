import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-accueil',
  imports: [RouterLink],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css',
})
export class Accueil {
  expertises = [
  { 
    id: '01', 
    title: 'Droit des Affaires', 
    desc: 'Accompagnement des entreprises : création de sociétés, fusions-acquisitions, secrétariat juridique et rédaction de baux commerciaux.' 
  },
  { 
    id: '02', 
    title: 'Droit Civil', 
    desc: 'Contentieux civil, droit des obligations, contrats et responsabilité civile. Protection du patrimoine et des intérêts privés.' 
  },
  { 
    id: '03', 
    title: 'Famille & Successions', 
    desc: 'Gestion sensible des procédures de divorce, garde d’enfants, pensions alimentaires et partage complexe de successions.' 
  },
  { 
    id: '04', 
    title: 'Droit du Travail', 
    desc: 'Défense des employeurs et salariés devant les conseils de prud’hommes. Ruptures conventionnelles et licenciements.' 
  },
  { 
    id: '05', 
    title: 'Contentieux & Exécution', 
    desc: 'Recouvrement de créances, injonctions de payer et mesures d’exécution. Une force d’action pour rétablir vos droits.' 
  },
  { 
    id: '06', 
    title: 'Droit Immobilier', 
    desc: 'Conseil en transactions immobilières, gestion des copropriétés, contentieux du voisinage et litiges locatifs.' 
  }
];

}
