    import { Routes } from '@angular/router';
    import { Accueil } from './home/accueil/accueil';
    import {  LoginComponent } from './auth/login/login';
    import { Register } from './auth/register/register';
import { guestGuard } from './guards/publicguards-guard';
import { roleGuard } from './guards/privateguards-guard';
import { Role } from './enums/role.enum';
import { DashClient } from './client/dash-client/dash-client';
import { NavbarClient } from './client/navbar-client/navbar-client';
import { NavbarSecretaire } from './secretaire/navbar-secretaire/navbar-secretaire';
import { DashSecretaire } from './secretaire/dash-secretaire/dash-secretaire';
import { Calendrier } from './secretaire/calendrier/calendrier';
import { ListeClient } from './secretaire/liste-client/liste-client';
import { Affaire } from './secretaire/affaire/affaire';
import { CLientDetail } from './secretaire/client-detail/client-detail';
import { VeriferClient } from './secretaire/verifer-client/verifer-client';

    export const routes: Routes = [
        { path:"home", title:"Home" , component:Accueil ,}
        ,
        { path:"login", title:"Login" ,component:LoginComponent ,canActivate:[guestGuard]} ,
        { path:"register", title:"Register" ,component:Register,canActivate:[guestGuard]} ,
        {
        path: "client",
        component:NavbarClient, 
       canActivate: [roleGuard], 
        data: { roles: [Role.CLIENT] }, 
       children: [
      { path: "", redirectTo: "dashboard", pathMatch: "full" }, 
      { path: "dashboard", title: "Mon Dashboard", component:DashClient  },
    //   { path: "audiences", title: "Mes Audiences", component: MesAudiencesComponent },
    //   { path: "rdv", title: "Mes Rendez-vous", component: MesRdvComponent },
    ]
  },
  {
    path: "secretaire",
       component:NavbarSecretaire, 
       canActivate: [roleGuard], 
        data: { roles: [Role.SECRETAIRE] }, 
       children: [
      
      { path: "dashboard", title: "Mon Dashboard", component:DashSecretaire },
      { path: "calendrier", title: "Mon Calendrier", component:Calendrier },
      { path: "clients", title: "Gérer les Clients", component:ListeClient },
      { path:"affaires/:clientId/:id", title:"Gérer les Affaires", component:Affaire},
      {path:"clientDetails/:id", title:"Détails du Client", component:CLientDetail},
        {path:"VerifierClient", title:"Détails du Client", component:VeriferClient},
      { path: "", redirectTo: "dashboard", pathMatch: "full" }
       ]
    
    },
        { path:"", redirectTo:"home", pathMatch:"full" }

    ];
