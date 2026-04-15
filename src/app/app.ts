import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Nav } from "./home/nav/nav";
import { ServiceUser } from './service/service-user';
import { AsyncPipe } from '@angular/common';
import { NavbarClient } from "./client/navbar-client/navbar-client";
import { Role } from './enums/role.enum';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav, AsyncPipe, NavbarClient],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
//   private router=inject(Router);
//   showNavbar(): boolean {
//   const hiddenRoutes = ['/client/dashboard', '/secretaire'];
//   return !hiddenRoutes.includes(this.router.url);
// }

  protected readonly title = signal('FrontCabinetAvocat');
  protected readonly Role = Role;
  private readonly userService= inject(ServiceUser);
  user$=this.userService.user$;

}
