import { Component, inject, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';

import { CreneauService } from '../../service/creneaux';
import { CreneauResSecretaire } from '../../interfaces/creneau-res-secretaire';

@Component({
  selector: 'app-calendrier',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendrier.html',
  styleUrl: './calendrier.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Calendrier implements OnInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  private creneauxService = inject(CreneauService);
  private cdr = inject(ChangeDetectorRef);
  dateRef: string = this.getWeekStartDate();
  isLoading = false;
  error: string = '';
  selectedEvent: any = null;
  showEventDetails = false;

  calendarOptions: any = {
    initialView: 'timeGridWeek',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    locale: frLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridWeek,timeGridDay'
    },
    slotMinTime: '08:00:00',
    slotMaxTime: '18:00:00',
    allDaySlot: false,
    height: 'auto',
    events: [],
    eventClick: (info: any) => {
      this.onEventClick(info.event);
    },
    datesSet: (info: any) => {
      this.dateRef = this.formatDate(info.start);
      this.loadPlanning();
    }
  };

  ngOnInit(): void {
    this.loadPlanning();
  }
  onEventClick(event: any): void {
    const creneauId = event.extendedProps?.creneauId;
    
    if (creneauId) {
      this.creneauxService.getCreneauPourSecretaire(creneauId).subscribe({
        next: (data: CreneauResSecretaire) => {
          this.selectedEvent = {
            ...data,
            startTime: event.start,
            endTime: event.end
          };
          this.showEventDetails = true;
          this.cdr.markForCheck();
          console.log('Event clicked:', this.selectedEvent);
        },
        error: (err) => {
          console.error('Erreur lors du chargement des détails:', err);
          this.error = 'Erreur lors du chargement des détails du créneau';
          this.cdr.markForCheck();
        }
      });
    }
  }
  closeEventDetails(): void {
    this.showEventDetails = false;
    this.selectedEvent = null;
    this.cdr.markForCheck();
  }
  bloquerCreneau(motif?: string): void {
    if (!this.selectedEvent) return;

    this.creneauxService.bloquerCreneau(this.selectedEvent.id, motif).subscribe({
      next: () => {
        console.log('Créneau bloqué');
        this.closeEventDetails();
        this.loadPlanning();
      },
      error: (err) => {
        console.error('Erreur lors du blocage:', err);
        this.error = 'Erreur lors du blocage du créneau';
        this.cdr.markForCheck();
      }
    });
  }
  supprimerCreneau(): void {
    if (!this.selectedEvent || !confirm('Êtes-vous sûr de vouloir supprimer ce créneau?')) return;

    this.creneauxService.supprimerCreneau(this.selectedEvent.id).subscribe({
      next: () => {
        console.log('Créneau supprimé');
        this.closeEventDetails();
        this.loadPlanning();
      },
      error: (err) => {
        console.error('Erreur lors de la suppression:', err);
        this.error = 'Erreur lors de la suppression du créneau';
        this.cdr.markForCheck();
      }
    });
  }
  private getWeekStartDate(): string {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));
    return this.formatDate(monday);
  }
  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-CA');
  }
  loadPlanning(): void {
    this.isLoading = true;
    this.error = '';
    this.cdr.markForCheck();

    this.creneauxService.getPlanningSemaineSecretaire(this.dateRef).subscribe({
      next: (data: CreneauResSecretaire[]) => {
        console.log(`Loaded ${data.length} creneaux for date: ${this.dateRef}`);

        const mappedEvents = data.map((c: CreneauResSecretaire) => ({
          id: c.id.toString(),
          start: `${c.dateJour}T${c.heureDebut}`,
          end: `${c.dateJour}T${c.heureFin}`,
          title: c.titre ?? (c.reservee ? 'Occupé' : 'Libre'),
          backgroundColor: c.reservee ? '#cc140e' : '#059669',
          borderColor: 'transparent',
          extendedProps: {
            reservee: c.reservee,
            creneauId: c.id
          }
        }));

        this.calendarOptions = {
          ...this.calendarOptions,
          events: mappedEvents
        };

        this.isLoading = false;
        this.cdr.markForCheck();

        if (this.calendarComponent?.getApi()) {
          this.calendarComponent.getApi().refetchEvents();
        }
      },
      error: (err) => {
        console.error('Erreur API:', err);
        this.error = 'Erreur lors du chargement du planning';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }
  refreshPlanning(): void {
    this.loadPlanning();
  }
  previousWeek(): void {
    const date = new Date(this.dateRef);
    date.setDate(date.getDate() - 7);
    this.dateRef = this.formatDate(date);
    this.loadPlanning();
  }
  nextWeek(): void {
    const date = new Date(this.dateRef);
    date.setDate(date.getDate() + 7);
    this.dateRef = this.formatDate(date);
    this.loadPlanning();
  }
  today(): void {
    this.dateRef = this.formatDate(new Date());
    this.loadPlanning();
  }
}