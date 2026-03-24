import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Accueil } from "./home/accueil/accueil";
import { Nav } from "./home/nav/nav";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Accueil, Nav],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('FrontCabinetAvocat');
}
