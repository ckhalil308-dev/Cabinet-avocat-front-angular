import { Component, inject, OnInit, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import { forkJoin } from 'rxjs';

import { CreneauService } from '../../service/creneaux';
import { RdvService } from '../../service/rdv-service';

@Component({
  selector: 'app-rdv',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, ReactiveFormsModule],
  templateUrl: './rdv.html',
  styleUrl: './rdv.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Rdv implements OnInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  
  private creneauxService = inject(CreneauService);
  private rdvService = inject(RdvService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  currentStep = 1;
  showBookingForm = false;
  submitting = false;
  selectedSlot: any = null;
  bookingForm!: FormGroup;

  calendarOptions: any = {
    initialView: 'timeGridWeek',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    locale: frLocale,
    firstDay: 1, 
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridWeek,dayGridMonth'
    },
    // On force le calendrier à se centrer sur aujourd'hui au chargement
    nowIndicator: true,
    slotMinTime: '08:00:00',
    slotMaxTime: '18:00:00',
    allDaySlot: false,
    height: 'auto',
    events: [],
    eventClick: (info: any) => this.onSlotClick(info.event),
    datesSet: (info: any) => {
      // LOGIQUE CRUCIALE : 
      // Si on est sur la vue actuelle, on commence à charger à partir d'AUJOURD'HUI.
      // Si l'utilisateur clique sur "Next", on charge à partir du début de la nouvelle vue.
      const today = new Date();
      const viewStart = info.start;
      
      // Si aujourd'hui est inclus dans la vue du calendrier, on commence par aujourd'hui
      const startLoadingFrom = (today >= info.start && today <= info.end) ? today : info.start;
      
      this.loadWeekSlots(startLoadingFrom);
    }
  };

  ngOnInit(): void {
    this.bookingForm = this.fb.group({
      motif: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  goToCalendar(): void {
    this.currentStep = 2;
    this.cdr.markForCheck();
  }

  goBack(): void {
    this.currentStep = 1;
    this.showBookingForm = false;
    this.cdr.markForCheck();
  }

  /**
   * Charge 7 jours de créneaux à partir de la date cible
   */
  loadWeekSlots(baseDate: Date): void {
    const requests = [];
    console.log("Chargement des créneaux à partir du :", this.formatSafeDate(baseDate));

    for (let i = 0; i < 7; i++) {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() + i);
      const dateStr = this.formatSafeDate(date);
      requests.push(this.creneauxService.getDisponiblesPourClient(dateStr));
    }

    forkJoin(requests).subscribe({
      next: (results: any[][]) => {
        const allCreneaux = results.flat();
        const mapped = allCreneaux.map(c => ({
          id: c.id.toString(),
          start: `${c.dateJour}T${c.heureDebut}`,
          end: `${c.dateJour}T${c.heureFin}`,
          title: 'Disponible',
          backgroundColor: '#059669',
          borderColor: 'transparent',
          extendedProps: { creneauId: c.id }
        }));

        this.calendarOptions = { ...this.calendarOptions, events: mapped };
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur API:', err);
        this.cdr.markForCheck();
      }
    });
  }

  private formatSafeDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onSlotClick(event: any): void {
    this.selectedSlot = {
      id: event.extendedProps.creneauId,
      start: event.start,
    };
    this.showBookingForm = true;
    this.cdr.markForCheck();
  }

  confirmBooking(): void {
    if (this.bookingForm.invalid || !this.selectedSlot) return;

    this.submitting = true;
    const request = {
      creneauId: this.selectedSlot.id,
      motif: this.bookingForm.value.motif
    };

    this.rdvService.proposerRdv(request).subscribe({
      next: () => {
        this.submitting = false;
        this.showBookingForm = false;
        this.bookingForm.reset();
        alert('Votre demande de rendez-vous a été envoyée avec succès.');
        this.currentStep = 1; 
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.submitting = false;
        alert(err.error?.message || 'Une erreur est survenue.');
        this.cdr.markForCheck();
      }
    });
  }

  closeBookingForm(): void {
    this.showBookingForm = false;
    this.bookingForm.reset();
    this.cdr.markForCheck();
  }
}