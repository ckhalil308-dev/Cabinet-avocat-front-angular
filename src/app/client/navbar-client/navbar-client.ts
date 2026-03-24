import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from "@angular/router";
import { ServiceUser } from '../../service/service-user';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-navbar-client',
  imports: [RouterLink, AsyncPipe, RouterOutlet],
  templateUrl: './navbar-client.html',
  styleUrl: './navbar-client.css',
})
export class NavbarClient {
  private readonly userService = inject(ServiceUser);
  user$ = this.userService.user$;

  logout() {
    this.userService.logout();
  }
}
