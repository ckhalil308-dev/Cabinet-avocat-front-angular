import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AffaireService, PageResponse } from '../../service/affaire';
import { AffaireReq } from '../../interfaces/affaire-req';
import { AffaireRes } from '../../interfaces/affaire-res';
import { StatusAffaire } from '../../enums/status-affaire';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Audienceres } from '../../interfaces/audienceres';
import { AudienceService } from '../../service/audience';
import { Audiencereq } from '../../interfaces/audiencereq';
import { AudienceCardComponent } from "../audience/audience";
import { CaseHeaderComponent } from "../selected-affaire/selected-affaire";

@Component({
  selector: 'app-affaire',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, AudienceCardComponent, CaseHeaderComponent],
  templateUrl: './affaire.html',
  styleUrl: './affaire.css',
})
export class Affaire implements OnInit {

  // ── Affaire ───────────────────────────────────────────────
  affaires: AffaireRes[] = [];
  selectedAffaire: AffaireRes | null = null;
  pageData: PageResponse<AffaireRes> | null = null;
  page = 0;
  size = 10;
  selectedStatut?: StatusAffaire;
  loading = false;
  errorMessage = '';
  successMessage = '';
  statusOptions = Object.values(StatusAffaire);
  showModal = false;
  isEditMode = false;
  formData: AffaireReq = {
    titre: '',
    description: '',
    numeroDossier: '',
    dateOuverture: new Date().toISOString().split('T')[0],
    statut: StatusAffaire.EN_COURS,
    clientId: 0,
  };
  editingAffaireId: number | null = null;
  id!: number;
  clientId!: number;
  cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  // ── Audiences ─────────────────────────────────────────────
  audiences: Audienceres[] = [];

  // Create
  showCreateForm = false;
  createForm!: FormGroup;

  // Edit
  showEditPopup = false;
  selectedAudienceId!: number;
  editForm!: FormGroup;

  // Postpone
  showPostponePopup = false;
  postponeAudienceId!: number;
  postponeForm!: FormGroup;

  constructor(
    private affaireService: AffaireService,
    private audienceService: AudienceService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
   this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
   console.log('Affaire ID from route:', this.id);
  this.clientId = Number(this.activatedRoute.snapshot.paramMap.get('clientId'));

  this.initAudienceForms(); // ✅ forms init first so affaireId gets this.id correctly

  if (this.id) {
    this.getAffaireById(this.id);  // ✅ was missing
    this.loadAudiences();
  } else {
    console.warn('No affaire ID provided in route parameters.');
  }
}
getAffaireById(id: number): void {
  this.loading = true;
  this.affaireService.getAffaireById(id).subscribe({
    next:  (res) => { this.selectedAffaire = res; this.loading = false; this.cdr.detectChanges(); },
    error: ()    => { this.errorMessage = 'Failed to load affaire details.'; this.loading = false; this.cdr.detectChanges(); },
  });
}
initAudienceForms(): void {
  this.createForm = this.fb.group({
    dateAudience: ['', Validators.required],
    tribunal:     ['', Validators.required],
    salle:        ['', Validators.required],
    remarques:    [''],
    affaireId:    [this.id, Validators.required],
  });
  this.editForm = this.fb.group({
    dateAudience: ['', Validators.required],
    tribunal:     ['', Validators.required],
    salle:        ['', Validators.required],
    remarques:    [''],
    affaireId:    ['', Validators.required],
  });
  this.postponeForm = this.fb.group({
    nouvelleDate: ['', Validators.required],
    motif:        ['', Validators.required],
  });
}

// ── Helper: fix datetime-local missing seconds ────────────
private formatDateTime(value: string): string {
  if (!value) return value;
  // datetime-local gives "2025-06-15T10:30" — Spring needs "2025-06-15T10:30:00"
  return value.length === 16 ? `${value}:00` : value;
}

loadAudiences(): void {
  this.audienceService.getAudiencesByAffaire(this.id).subscribe({
    next: (data) => {
      this.audiences = data;
      this.cdr.detectChanges();
    },
    error: (err) => console.error('Error loading audiences', err),
  });
}

// ── Audience: Create ──────────────────────────────────────
openCreateForm(): void {
  // ✅ Reset then explicitly set affaireId AFTER reset
  this.createForm.reset();
  this.createForm.patchValue({ affaireId: this.id });
  this.showCreateForm = true;
}

closeCreateForm(): void {
  this.showCreateForm = false;
}

submitCreate(): void {
  if (this.createForm.invalid) return;
  const audienceReq: Audiencereq = {
    dateAudience: this.formatDateTime(this.createForm.value.dateAudience), // ✅ fix seconds
    tribunal:     this.createForm.value.tribunal,
    salle:        this.createForm.value.salle,
    remarques:    this.createForm.value.remarques ?? '',
    affaireId:    this.id,
  };
  this.audienceService.createAudience(audienceReq).subscribe({
    next: (created) => {
      this.audiences = [...this.audiences, created]; // ✅ triggers change detection
      this.closeCreateForm();
           this.cdr.detectChanges();
      
    },
    error: (err) => console.error('Error creating audience', err.error),
  });
}

// ── Audience: Edit ────────────────────────────────────────
openEditPopup(audience: Audienceres): void {
  this.selectedAudienceId = audience.id;
  this.editForm.patchValue({
    dateAudience: audience.dateAudience,
    tribunal:     audience.tribunal,
    salle:        audience.salle,
    remarques:    audience.remarques,
    affaireId:    audience.affaireId,

  });
  this.showEditPopup = true;
}

closeEditPopup(): void {
  this.showEditPopup = false;
}

submitEdit(): void {
  if (this.editForm.invalid) return;
  const audienceReq: Audiencereq = {
    dateAudience: this.formatDateTime(this.editForm.value.dateAudience), // ✅ fix seconds
    tribunal:     this.editForm.value.tribunal,
    salle:        this.editForm.value.salle,
    remarques:    this.editForm.value.remarques ?? '',
    affaireId:    this.editForm.value.affaireId,
  };
  this.audienceService.updateAudience(this.selectedAudienceId, audienceReq).subscribe({
    next: (updated) => {
      this.audiences = this.audiences.map((a) =>   // ✅ immutable update
        a.id === this.selectedAudienceId ? updated : a
      );
      this.closeEditPopup();
      this.cdr.detectChanges();
    },
    error: (err) => { console.error('Error updating audience', err.error); this.cdr.detectChanges(); }     
  });
}

// ── Audience: Delete ──────────────────────────────────────
deleteAudience(id: number): void {
  if (!confirm('Confirmer la suppression ?')) return;
  this.audienceService.deleteAudience(id).subscribe({
    next:  () => {
      this.audiences = this.audiences.filter((a) => a.id !== id);
      this.cdr.detectChanges();
    },
    error: (err) => console.error('Error deleting audience', err),
  });
}

// ── Audience: Postpone ────────────────────────────────────
openPostponePopup(id: number): void {
  this.postponeAudienceId = id;
  this.postponeForm.reset();
  this.showPostponePopup = true;
}

closePostponePopup(): void {
  this.showPostponePopup = false;
}

submitPostpone(): void {
  if (this.postponeForm.invalid) return;
  const nouvelleDate = this.formatDateTime(this.postponeForm.value.nouvelleDate); // ✅ fix seconds
  const motif = this.postponeForm.value.motif;
  this.audienceService.postponeAudience(this.postponeAudienceId, nouvelleDate, motif).subscribe({
    next: (updated) => {
      this.audiences = this.audiences.map((a) =>
        a.id === this.postponeAudienceId ? updated : a
      );
      this.closePostponePopup();
    },
    error: (err) => console.error('Error postponing audience', err),
  });
}
}