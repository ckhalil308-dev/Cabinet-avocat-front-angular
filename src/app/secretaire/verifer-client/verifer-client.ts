import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ServiceUser } from '../../service/service-user';
import { Client } from '../../interfaces/client';
import { FormBuilder } from '@angular/forms';
import { Pagination } from "../../pagination/pagination/pagination";

@Component({
  selector: 'app-verifer-client',
  imports: [Pagination],
  templateUrl: './verifer-client.html',
  styleUrl: './verifer-client.css',
})
export class VeriferClient {
   serviceuser:ServiceUser=inject(ServiceUser);
  clients: Client[] = [];
  fb:FormBuilder=inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  page: number = 0;
 loading: boolean = false;
  totalPages: number = 0;
  loadClients() {
      
    this.loading = true;
    this.serviceuser.getNonVerifiedClients(this.page,5).subscribe({
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
VerifierClient(clientId: number) {
  this.serviceuser.verifyClient(clientId).subscribe({
    next: (data: any) => {
      console.log('Client vérifié :', data);
      this.loadClients(); 
      this.cdr.detectChanges();
    }
      , error: (err: any) => {
        console.error('Erreur lors de la vérification du client :', err.error);
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

}
