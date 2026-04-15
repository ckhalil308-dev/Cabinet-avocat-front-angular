import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceUser } from '../../service/service-user';
import { Client } from '../../interfaces/client';
import { AffaireService } from '../../service/affaire';
import { AffaireRes } from '../../interfaces/affaire-res';
import { AffaireReq } from '../../interfaces/affaire-req';
import { forkJoin } from 'rxjs';
import { StatusAffaire } from '../../enums/status-affaire';
import { Uneaffaire } from "../Uneaffaire/Uneaffaire";
import { AudienceService } from '../../service/audience';
import { Audienceres } from '../../interfaces/audienceres';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Uneaffaire, RouterLink],
  templateUrl: './client-detail.html',
  styleUrl: './client-detail.css',
})
export class CLientDetail implements OnInit {

  router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private userService = inject(ServiceUser);
  private audienceService=inject(AudienceService);
  private cdr = inject(ChangeDetectorRef);
  private affaireService = inject(AffaireService);
  private fb = inject(FormBuilder);
  error:string=''
  clientDetails: Client | undefined;
  affaireClient: AffaireRes[] = [];
  isLoading = true;
  isSubmitting = false;

  isModalOpen = false;
  editingAffaireId: number | null = null; 

  StatusAffaire = StatusAffaire;
  statusOptions = Object.values(StatusAffaire);

  affaireForm!: FormGroup;
   clientId!: number;

  ngOnInit(): void {
    this.clientId = Number(this.activatedRoute.snapshot.params['id']);
    this.initForm();
     
    forkJoin({
      client:   this.userService.getClientById(this.clientId),
      affaires: this.affaireService.getAffairesByClientId(this.clientId),
    }).subscribe({
      next: ({ client, affaires }) => {
        this.audience = [];
        this.clientDetails = client;
        affaires.forEach(affaire => {
          this.getAudiencesperAffaire(affaire.id);
        });
        this.affaireClient = affaires;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading data:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  private initForm(affaire?: AffaireRes): void {
    this.affaireForm = this.fb.group({
      titre:         [affaire?.titre ?? '',          Validators.required],
      description:   [affaire?.description ?? '',    Validators.required],
      numeroDossier: [affaire?.numeroDossier ?? '',  Validators.required],
      dateOuverture: [affaire?.dateOuverture ?? '',  Validators.required],
      statut:        [affaire?.statut ?? StatusAffaire.EN_COURS, Validators.required],
      clientId:      [this.clientId,                 Validators.required],
    });
  }

  openCreateModal(): void {
    this.editingAffaireId = null;
    this.initForm();
    this.isModalOpen = true;
  }
  navigate(){
    this.router.navigate(['/secretaire/affaire']);
  }
  openEditModal(affaire: AffaireRes): void {
    this.editingAffaireId = affaire.id;
    this.initForm(affaire);
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.editingAffaireId = null;
    this.initForm();
    this.error='';
  }
  

  submitAffaire(): void {
    if (this.affaireForm.invalid) return;
    this.isSubmitting = true;

    const payload: AffaireReq = this.affaireForm.value;

    if (this.editingAffaireId !== null) {
      this.affaireService.updateAffaire(this.editingAffaireId, payload).subscribe({
        next: (updated: AffaireRes) => {
          this.affaireClient = this.affaireClient.map(a =>
            a.id === this.editingAffaireId ? updated : a
          );
          this.isSubmitting = false;
          this.closeModal();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error updating affaire:', err.error.message);
          this.error=err.error.message
          this.isSubmitting = false;
           this.cdr.markForCheck();
        },
      });
    } else {
      // — Create mode
      this.affaireService.createAffaire(payload).subscribe({
        next: (created: AffaireRes) => {
          this.affaireClient = [...this.affaireClient, created];
          this.isSubmitting = false;
          this.closeModal();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error creating affaire:', err.error.message);
          this.isSubmitting = false;
          this.error=err.error.message
          this.cdr.markForCheck();
        },
      });
    }
  }
  audience:Audienceres[]=[]; 
 getAudiencesperAffaire(affaireId: number) {
  this.audienceService.getAudiencesByAffaire(affaireId).subscribe({
    next: (audiences) => {
      // On ajoute les nouvelles audiences à la liste existante au lieu de remplacer
      this.audience = [...this.audience, ...audiences];
      this.cdr.detectChanges(); // Important pour mettre à jour la vue
    },
    error: (err) => console.error('Error fetching audiences', err)
  });
}
 getAudiencesForAffaire(affaireId: number): Audienceres[] {
  return this.audience.filter(audience => audience.affaireId === affaireId);
 }
 

  deleteAffaire(id: number): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette affaire ?')) return;

    this.affaireService.deleteAffaire(id).subscribe({
      next: () => {
        this.affaireClient = this.affaireClient.filter(a => a.id !== id);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error deleting affaire:', err);
         this.cdr.detectChanges();
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/secretaire/clients']);
  }
}