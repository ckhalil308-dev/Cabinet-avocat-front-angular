import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-audience-card',
  standalone: true,
  imports: [CommonModule], // DatePipe is included in CommonModule
  templateUrl: './audience.html'
})
export class AudienceCardComponent {
  @Input({ required: true }) audience!: any; 
  @Input({ required: true }) i!: number;

  @Output() edit = new EventEmitter<any>();
  @Output() postpone = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();

  onEdit(event: Event) {
    event.stopPropagation();
    this.edit.emit(this.audience);
  }

  onPostpone(event: Event) {
    event.stopPropagation();
    this.postpone.emit(this.audience.id);
  }

  onDelete(event: Event) {
    event.stopPropagation();
    this.delete.emit(this.audience.id);
  }
}