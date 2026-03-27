import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RdvService } from '../../service/rdv-service';
import { RdvRes } from '../../interfaces/rdv-res';
import { StatusRdv } from '../../enums/status-rdv';


@Component({
  selector: 'app-mes-rdv',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mes-rdv.html',
  styleUrl: './mes-rdv.css',
})
export class MesRdv implements OnInit {
  private rdvService = inject(RdvService);
  private cdr = inject(ChangeDetectorRef);
  
  rdvs: RdvRes[] = [];
  StatusRdv = StatusRdv;
  currentStatus: StatusRdv = StatusRdv.PENDING;

  showCancelModal = false;
  selectedRdvId: number | null = null;
  refusalReason = '';
  isSubmitting = false;

  ngOnInit() {
    this.loadRdvs();
  }

  // On passe le statut actuel au service
  loadRdvs() {
    this.rdvService.getRdvsPourSecretaire(this.currentStatus).subscribe({
      next: (res) => {
        this.rdvs = res;
        this.cdr.markForCheck();
      },
      error: (err) => console.error(err)
    });
  }
  filterByStatus(status: StatusRdv) {
    this.currentStatus = status;
    this.loadRdvs();
  }

  confirmerRdv(id: number) {
    this.rdvService.confirmerRdv(id).subscribe({
      next: () => this.loadRdvs(),
      error: (err) => console.error(err)
    });
  }

  openCancelModal(id: number) {
    this.selectedRdvId = id;
    this.refusalReason = '';
    this.showCancelModal = true;
    this.cdr.markForCheck();
  }

  closeCancelModal() {
    this.showCancelModal = false;
    this.selectedRdvId = null;
    this.cdr.markForCheck();
  }

  submitCancel() {
    if (!this.selectedRdvId || !this.refusalReason.trim()) return;
    this.isSubmitting = true;
    this.rdvService.annulerRdv(this.selectedRdvId, this.refusalReason).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.closeCancelModal();
        this.loadRdvs();
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error(err);
      }
    });
  }
}