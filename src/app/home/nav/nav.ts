import { Component, inject } from '@angular/core';
import { Route, Router, RouterLink } from "@angular/router";
import { ServiceUser } from '../../service/service-user';
import { Client } from '../../interfaces/client';
import { AsyncPipe } from '@angular/common';
import { routes } from '../../app.routes';

@Component({
  selector: 'app-nav',
  imports: [RouterLink ,AsyncPipe] ,
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
   private readonly userService= inject(ServiceUser);
   user$ = this.userService.user$; 
   router:Router=inject(Router);
  hideNav(){
    const hiddenrutes = ['/login', '/register'];
    return hiddenrutes.includes(this.router.url);
  }
  logout() {
    this.userService.logout();
    
  }


}
