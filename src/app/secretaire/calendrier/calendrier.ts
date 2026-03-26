import { Component, inject, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';

import { CreneauService } from '../../service/creneaux';
import { CreneauResSecretaire } from '../../interfaces/creneau-res-secretaire';
import { CreneauRequest } from '../../interfaces/creneau-request';
import { ModifierCreneauDto } from '../../interfaces/modifier-creneau-dto';

@Component({
  selector: 'app-calendrier',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, ReactiveFormsModule,FormsModule,],
  templateUrl: './calendrier.html',
  styleUrl: './calendrier.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Calendrier implements OnInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  private creneauxService = inject(CreneauService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  dateRef: string = this.getWeekStartDate();
  isLoading = false;
  error: string = '';
  selectedEvent: CreneauResSecretaire | null = null;
  showEventDetails = false;
  showCreneauForm = false;  
  genererCreneaux=false;
  creneauForm!: FormGroup; 
  editEventForm!: FormGroup; 
  isEditMode = false;  
  dateCreneaux !: string 
  editingCreneauId: number | null = null;  
  submitting = false;
  isEditingFields = false;  
  calendarOptions: any = {
    initialView: 'timeGridWeek',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    locale: frLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridWeek,timeGridDay'
    },
    editable: true,
    slotMinTime: '08:00:00',
    slotMaxTime: '18:00:00',
    slotDuration: '00:30:00',
    
    allDaySlot: false,
    height: 'auto',
    events: [],
    eventClick: (info: any) => {
      this.onEventClick(info.event);
    },
    select: (info: any) => {
      this.onSelectSlot(info.start, info.end);
    },
    selectable: true,
    datesSet: (info: any) => {
      this.dateRef = this.formatDate(info.start);
      this.loadPlanning();
    }
  };
  ngOnInit(): void {
    this.initCreneauForm();
    this.initEditEventForm();
    this.loadPlanning();
  }
  initCreneauForm(): void {
    this.creneauForm = this.fb.group({
      titre: ['', Validators.required],
      dateJour: ['', Validators.required],
      heureDebut: ['', Validators.required],
      heureFin: ['', Validators.required]
    });
  }
  initEditEventForm(): void {
    this.editEventForm = this.fb.group({
      titre: [''],
      dateJour: [''],
      heureDebut: [''],
      heureFin: [''],
      reservee:['']
    });
  }
  onSelectSlot(start: Date, end: Date): void {
    this.isEditMode = false;
    this.editingCreneauId = null;
    this.showCreneauForm = true;

    const dateStr = this.formatDate(start);
    const startTime = this.formatTime(start);
    const endTime = this.formatTime(end);

    this.creneauForm.patchValue({
      dateJour: dateStr,
      heureDebut: startTime,
      heureFin: endTime,
      titre: ''
    });

    this.cdr.markForCheck();
  }

  /**
   * Handle event click - OPEN EVENT DETAILS
   */
  onEventClick(event: any): void {
    const creneauId = event.extendedProps?.creneauId;
    
    if (creneauId) {
      this.creneauxService.getCreneauPourSecretaire(creneauId).subscribe({
        next: (data: CreneauResSecretaire) => {
          this.selectedEvent = data;
          this.showEventDetails = true;
          this.isEditingFields = false;  
          this.editEventForm.patchValue({
            titre: data.titre,
            dateJour: data.dateJour,
            heureDebut: data.heureDebut,
            heureFin: data.heureFin,
            reservee: data.reservee
          });
          
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
  submitCreneauForm(): void {
    if (this.creneauForm.invalid) {
      this.creneauForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.cdr.markForCheck();

    const newCreneau: CreneauRequest = {
      titre: this.creneauForm.value.titre,
      dateJour: this.creneauForm.value.dateJour,
      heureDebut: this.creneauForm.value.heureDebut,
      heureFin: this.creneauForm.value.heureFin
    };

    this.creneauxService.creerCreneau(newCreneau).subscribe({
      next: () => {
        console.log('Créneau créé');
        this.submitting = false;
        this.closeCreneauForm();
        this.loadPlanning();
      },
      error: (err) => {
        console.error('Erreur lors de la création:', err.error);
        this.error = err.error?.message || 'Erreur lors de la création du créneau';
        this.submitting = false;
        this.cdr.markForCheck();
      }
    });
  }
  closeCreneauForm(): void {
    this.showCreneauForm = false;
    this.isEditMode = false;
    this.editingCreneauId = null;
    this.creneauForm.reset();
    this.cdr.markForCheck();
  }
  toggleEditMode(): void {
    this.isEditingFields = !this.isEditingFields;
    this.cdr.markForCheck();
  }
  modifierEvent(): void {
    if (this.editEventForm.invalid || !this.selectedEvent) {
      this.editEventForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.cdr.markForCheck();

    const modifierDto: ModifierCreneauDto = {
      motif: this.editEventForm.value.titre || 'Sans titre',
      reserve: this.editEventForm.value.reservee 
    };
    console.log('Modifier DTO:', modifierDto);

    this.creneauxService.modifierCreneau(this.selectedEvent.id, modifierDto).subscribe({
      next: () => { 
        console.log('Créneau modifié avec succès');
        this.submitting = false;
        this.isEditingFields = false;
        this.closeEventDetails();
        this.loadPlanning();
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        console.error('Erreur lors de la modification:', err.error);
        this.error = err.error?.message || 'Erreur lors de la modification du créneau';
        this.submitting = false;
        this.cdr.markForCheck();
      }
    });
  }
  supprimerCreneau(): void {
    if (!this.selectedEvent || !confirm('Êtes-vous sûr de vouloir supprimer ce créneau?')) return;

    this.submitting = true;
    this.cdr.markForCheck();

    this.creneauxService.supprimerCreneau(this.selectedEvent.id).subscribe({
      next: () => {
        console.log('Créneau supprimé');
        this.submitting = false;
        this.closeEventDetails();
        this.loadPlanning();
      },
      error: (err) => {
        console.error('Erreur lors de la suppression:', err.error);
        this.error = err.error?.message || 'Erreur lors de la suppression du créneau';
        this.submitting = false;
        this.cdr.markForCheck();
      }
    });
  }
  closeEventDetails(): void {
    this.showEventDetails = false;
    this.selectedEvent = null;
    this.isEditingFields = false;
    this.cdr.markForCheck();
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
  private formatTime(date: Date): string {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }
 genererCreneauxJournaliers(): void {
  this.error = ''; 
  this.submitting = true;
  this.cdr.markForCheck();

  if(this.dateCreneaux){
    this.dateRef = this.formatDate(new Date(this.dateCreneaux));
  }

  this.creneauxService.genererCreneauxJournaliers(this.dateRef).subscribe({
    next: () => {
      console.log('Créneaux journaliers générés');
      this.submitting = false;
      this.loadPlanning();
      this.genererCreneaux = false;
      this.cdr.markForCheck();
    },
    error: (err) => {
      console.error('Erreur lors de la génération:', err);
      this.error = err.error?.message || err.error || 'Erreur lors de la génération';
      this.submitting = false;
      this.cdr.detectChanges(); 
    }
  });
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
        console.error('Erreur API:', err.error);
        this.error = err.error?.message || 'Erreur lors du chargement du planning';
        this.error = err.error?.message || 'Erreur lors du chargement du planning';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  refreshPlanning(): void {
    this.loadPlanning();
  }
//  ajouter
}