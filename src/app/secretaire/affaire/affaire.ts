import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AffaireService, PageResponse } from '../../service/affaire';
import { AffaireReq } from '../../interfaces/affaire-req';
import { AffaireRes } from '../../interfaces/affaire-res';
import { StatusAffaire } from '../../enums/status-affaire';

@Component({
  selector: 'app-affaire',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './affaire.html',
  styleUrl: './affaire.css',
})
export class Affaire implements OnInit {
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

  // Modal state
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

  constructor(private affaireService: AffaireService) {}

  ngOnInit(): void {
    this.getAllAffaires();
  }

  getAllAffaires(): void {
    this.loading = true;
    this.errorMessage = '';

    this.affaireService
      .getAllAffaires(this.selectedStatut, this.page, this.size)
      .subscribe({
        next: (res) => {
          console.log('Affaires loaded:', res);
          this.pageData = res;
          this.affaires = res.content ?? [];
          this.loading = false;
        },
        error: () => {
          this.errorMessage = 'Failed to load affaires.';
          this.loading = false;
        },
      });
  }

  onStatusChange(statut?: StatusAffaire): void {
    this.selectedStatut = statut;
    this.page = 0;
    this.getAllAffaires();
  }

  setPage(page: number) {
    this.page = page;
    this.getAllAffaires();
  }

  getAffaireById(id: number): void {
    this.loading = true;
    this.errorMessage = '';

    this.affaireService.getAffaireById(id).subscribe({
      next: (res) => {
        this.selectedAffaire = res;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load affaire details.';
        this.loading = false;
      },
    });
  }
  openEditModal(affaire: AffaireRes): void {
    this.isEditMode = true;
    this.editingAffaireId = affaire.id;
    this.formData = {
      titre: affaire.titre,
      description: affaire.description,
      numeroDossier: affaire.numeroDossier,
      dateOuverture: this.formatDateForInput(affaire.dateOuverture),
      statut: affaire.statut,
      clientId: affaire.clientId,
    };
    this.showModal = true;
    this.errorMessage = '';
  }

  closeModal(): void {
    this.showModal = false;
    this.isEditMode = false;
    this.editingAffaireId = null;
  }

  private formatDateForInput(date: string | Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }


  updateAffaire(id: number, payload: AffaireReq): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.affaireService.updateAffaire(id, payload).subscribe({
      next: () => {
        this.successMessage = 'Affaire updated successfully.';
        this.loading = false;
        this.closeModal();
        this.getAllAffaires();
      },
      error: (err) => {
        console.error('Error updating affaire:', err);
        this.errorMessage = 'Failed to update affaire.';
        this.loading = false;
      },
    });
  }

  deleteAffaire(id: number): void {
    if (!confirm('Are you sure you want to delete this affaire?')) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.affaireService.deleteAffaire(id).subscribe({
      next: () => {
        this.successMessage = 'Affaire deleted successfully.';
        this.loading = false;
        this.selectedAffaire = null;
        this.getAllAffaires();
      },
      error: (err) => {
        console.error('Error deleting affaire:', err);
        this.errorMessage = 'Failed to delete affaire.';
        this.loading = false;
      },
    });
  }

  refresh(): void {
    this.getAllAffaires();
  }
}