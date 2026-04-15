import { Component, Input } from '@angular/core';
import { AffaireRes } from '../../interfaces/affaire-res';
import { DatePipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-uneaffaire',
  imports: [DatePipe,NgClass],
  templateUrl: './Uneaffaire.html',
 
})
export class Uneaffaire {
  @Input() affaire!: AffaireRes;

}
