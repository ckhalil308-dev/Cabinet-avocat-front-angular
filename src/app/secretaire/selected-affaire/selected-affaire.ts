import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-case-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selected-affaire.html'
})
export class CaseHeaderComponent {
  // On utilise "affaire" comme nom d'input pour être générique
  @Input({ required: true }) affaire!: any;
}