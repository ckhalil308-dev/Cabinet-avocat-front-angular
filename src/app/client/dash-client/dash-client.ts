import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AffaireRes } from '../../interfaces/affaire-res';
import { Audienceres } from '../../interfaces/audienceres';
import { AffaireService } from '../../service/affaire';
import { AudienceService } from '../../service/audience';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-dash-client',
  imports: [CommonModule, RouterLink],
  templateUrl: './dash-client.html',
  styleUrl: './dash-client.css',
})
export class DashClient implements OnInit {
  crd:ChangeDetectorRef=inject(ChangeDetectorRef);
  Affaire:AffaireRes[]=[];
  Audience:Audienceres []=[];
  affaireService:AffaireService=inject(AffaireService);
  audienceService:AudienceService=inject(AudienceService);

  ngOnInit(): void {
    this.affaireService.getMyAffaires().subscribe((affaires) => {
      console.log('Affaires récupérées :', affaires);
      this.Affaire = affaires;
      this.crd.detectChanges();
    });

    this.audienceService.getAudiencesForCurrentClient().subscribe((audiences) => {
      console.log('Audiences récupérées :', audiences);
      this.Audience = audiences;
      this.crd.detectChanges();
    });
  }
  get dossierEnCours() {
  return this.Affaire.filter(a => a.statut === 'EN_COURS').length;
}

get dossierGagnee() {
  return this.Affaire.filter(a => a.statut === 'GAGNEE').length;
}
}
