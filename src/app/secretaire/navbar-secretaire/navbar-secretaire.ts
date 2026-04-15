import { Component, inject } from '@angular/core';
import { ServiceUser } from '../../service/service-user';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-navbar-secretaire',
  imports: [AsyncPipe, RouterOutlet,RouterLink],
  templateUrl: './navbar-secretaire.html',
  styleUrl: './navbar-secretaire.css',
})
export class NavbarSecretaire {
  private readonly userService = inject(ServiceUser);
  user$ = this.userService.user$;
  logout() {
    this.userService.logout();
  }

}
