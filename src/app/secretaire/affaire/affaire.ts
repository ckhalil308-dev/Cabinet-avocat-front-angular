import { CommonModule } from '@angular/common';

import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { AffaireService, PageResponse } from '../../service/affaire';

import { AffaireReq } from '../../interfaces/affaire-req';

import { AffaireRes } from '../../interfaces/affaire-res';

import { StatusAffaire } from '../../enums/status-affaire';

import { ActivatedRoute, RouterLink } from '@angular/router';



@Component({

  selector: 'app-affaire',

  standalone: true,

  imports: [CommonModule, FormsModule, RouterLink],

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

 



  constructor(private affaireService: AffaireService,private activatedRoute: ActivatedRoute) {}

   id !:number
   clientId !:number

  ngOnInit(): void {

     this.id = Number(this.activatedRoute.snapshot.paramMap.get('id') as string);
      this.clientId = Number(this.activatedRoute.snapshot.paramMap.get('clientId') as string);

     if (this.id) {

     this.getAffaireById(this.id);

      } else {

       console.warn('No affaire ID provided in route parameters.');

      }





  }

    getAffaireById(id: number): void {

    this.loading = true;

    this.errorMessage = '';



    this.affaireService.getAffaireById(id).subscribe({

      next: (res) => {

        console.log('Affaire details loaded:', res);

        this.selectedAffaire = res;

        this.loading = false;

      },

      error: () => {

        this.errorMessage = 'Failed to load affaire details.';

        this.loading = false;

      },

    });

  }

}