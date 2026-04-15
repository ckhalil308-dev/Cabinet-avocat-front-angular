import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ServiceUser } from '../../service/service-user';
import { Client } from '../../interfaces/client';
import { Pagination } from "../../pagination/pagination/pagination";
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { AffaireService } from '../../service/affaire';
import { AffaireRes } from '../../interfaces/affaire-res';
import { ClientReq } from '../../interfaces/client-req';

@Component({
  selector: 'app-liste-client',
  imports: [Pagination, ReactiveFormsModule, RouterLink],
  templateUrl: './liste-client.html',
  styleUrl: './liste-client.css',
})
export class ListeClient implements OnInit {
  serviceuser:ServiceUser=inject(ServiceUser);
  clients: Client[] = [];
  fb:FormBuilder=inject(FormBuilder);
  EditClientForm=this.fb.group({
  id:[0],
  nom:[''],
  prenom:[''],
  email:[''],
  numTelephone:[''],
  });

  page: number = 0;
 loading: boolean = false;
  totalPages: number = 0;
  
  
  private cdr = inject(ChangeDetectorRef);
    loadClients() {
      
    this.loading = true;
    this.serviceuser.getAllClients(this.page,5).subscribe({
      next: (data: any) => {
      this.loading = false;
      console.log('loading :', this.loading);
      this.clients = data.content; 
      this.totalPages = data.totalPages; 
      this.page = data.number;
      this.cdr.detectChanges();
      },
       error: (err: any)=>{
        this.loading = false;
        console.error('Erreur lors de la récupération des clients :', err.error);
        this.cdr.detectChanges();
      }
    });


}


  ngOnInit(): void {
    this.loadClients();
  }
  setPage(page: number) {
    this.page = page;
    this.loadClients();
  }
  DeleteClient(id: number) {
    confirm('Êtes-vous sûr de vouloir supprimer ce client ?') &&
    
    this.serviceuser.supprimerClient(id).subscribe({
      next: (data: any) => {
        console.log('Client supprimé :', data);
        this.loadClients(); 
      },
      error: (err: any) => {
        console.error('Erreur lors de la suppression du client :', err.error);
      }
    });
}
isEditMode: boolean = false;
getClient(idClient:number){ {
    this.isEditMode = true;
    this.serviceuser.getClientById(idClient).subscribe({
      next: (data: Client) => {
        console.log('Client récupéré pour édition :', data);
        this.EditClientForm.patchValue({
          id: data.id,
          nom: data.nom,
          prenom: data.prenom,
          email: data.email,
          numTelephone: data.numTelephone
        })}
        ,
        error :( err:any)=>{
          console.error('Erreur lors de la récupération du client pour édition :', err.error);
        }
      });
}
}

modifierClient() {
  const clientData :ClientReq={
    nom: this.EditClientForm.value.nom || '',
    prenom: this.EditClientForm.value.prenom || '',
    email: this.EditClientForm.value.email || '',
    numTelephone: Number(this.EditClientForm.value.numTelephone) || 0,
  
  };
  const id = Number(this.EditClientForm.value.id);
  console.log('Données du client à modifier :', clientData);
  this.serviceuser.modifierClient(id, clientData).subscribe({
    next: (data: any) => {
       this.isEditMode = false;
      console.log('Client modifié :', data);
      this.loadClients();
     
    },
    error: (err: any) => {
      console.error('Erreur lors de la modification du client :', err.error);
    }
  });

}

}

