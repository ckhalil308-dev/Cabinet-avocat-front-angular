import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RdvService } from '../../service/rdv-service';
import { RdvRes } from '../../interfaces/rdv-res';
import { StatusRdv } from '../../enums/status-rdv';

@Component({
  selector: 'app-mes-rdv-client',
  standalone: true,
  imports: [CommonModule,DatePipe],
  templateUrl: './mes-rdvs.html',
  
})

export class MesRdvClient implements OnInit {
  private rdvService = inject(RdvService);
  private cdr = inject(ChangeDetectorRef);
  
  rdvs: RdvRes[] = [];
  StatusRdv = StatusRdv;
  
  // Par défaut, on affiche les rendez-vous en attente pour le client
  currentStatus: StatusRdv = StatusRdv.PENDING;

  ngOnInit() {
    this.loadRdvs();
  }

  /**
   * Charge les rendez-vous du client connecté via le service
   */
  loadRdvs() {
    this.rdvService.getRdvsPourClient(this.currentStatus).subscribe({
      next: (res) => {
        this.rdvs = res;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des RDV client:", err);
        this.cdr.markForCheck();
      }
    });
  }

  /**
   * Filtre la liste selon le statut sélectionné (PENDING, CONFIRMED, etc.)
   */
  filterByStatus(status: StatusRdv) {
    this.currentStatus = status;
    this.loadRdvs();
  }
}
