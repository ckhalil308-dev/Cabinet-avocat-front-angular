    import { Routes } from '@angular/router';
    import { Accueil } from './home/accueil/accueil';
    import {  LoginComponent } from './auth/login/login';
    import { Register } from './auth/register/register';

    export const routes: Routes = [
        { path:"home", title:"Home" , component:Accueil}
        ,
        { path:"login", title:"Login" ,component:LoginComponent} ,
        { path:"register", title:"Register" ,component:Register} ,
        { path:"", redirectTo:"home", pathMatch:"full" }
    ];
