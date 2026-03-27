import { Component, inject } from '@angular/core';
import { ServiceUser } from '../../service/service-user';
import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import { DashboardRes } from '../../interfaces/dashboaedres';
import { Observable } from 'rxjs';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-dash-secretaire',
  imports: [AsyncPipe, DatePipe, NgClass, RouterLink],
  templateUrl: './dash-secretaire.html',
  styleUrl: './dash-secretaire.css',
})
export class DashSecretaire {
  userService:ServiceUser=inject(ServiceUser);
 dashboardData$: Observable<DashboardRes> = this.userService.getDashboard();
 
     

}
