import { Component, inject, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, timeout } from 'rxjs/operators';
import { ServiceAuth } from '../../service/service-auth';
import { LoginInt } from '../../interfaces/loginInt';
import { Authresponse } from '../../interfaces/authresponse';
import { ErrorInterface } from '../../interfaces/error';
import { ServiceUser } from '../../service/service-user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  error: string = '';
  isLoading = false;

  private fb = inject(FormBuilder);
  private userService:ServiceUser = inject(ServiceUser);
  private authService :ServiceAuth = inject(ServiceAuth);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();
  private errorTimeout: any;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.error = '';
    this.cdr.markForCheck();

    const credentials: LoginInt = this.loginForm.value;

    this.authService.login(credentials)
      .pipe(
        timeout(10000), 
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res: Authresponse) => {
          this.isLoading = false;
          this.error = '';
          this.cdr.markForCheck();
          console.log('Login successful', res);
          localStorage.setItem('token', res.Token);
          this.userService.getMe().subscribe({
          next: (client) => {
          console.log('Contexte chargé pour :', client.nom);
          if(client.role === 'CLIENT') {
            this.router.navigate(['/client']);
          } 
          else if(client.role === 'SECRETAIRE') {
            this.router.navigate(['/secretaire']);
          }
          console.log(' l\'utilisateur :', this.userService.getCurrentUser());
            },
            error: (err) => {
              console.error('Erreur lors du chargement du contexte utilisateur :', err);}
             
          });
          this.loginForm.reset();
          this.router.navigate(['/home'], { replaceUrl: true });
        },
        error: (err: any) => {
          console.error('Login failed:', err);
          
          this.isLoading = false;
          
     
          if (this.errorTimeout) {
            clearTimeout(this.errorTimeout);
          }
          
          if (err.name === 'TimeoutError') {
            this.error = 'La connexion a dépassé le délai imparti. Veuillez réessayer.';
          } else {
            const errorResponse: ErrorInterface= err?.error;
            
            this.error = errorResponse?.message || 
              err?.message || 
              err?.statusText || 
              'une erreur est survenue lors de la connexion';
          }
          
          this.cdr.markForCheck();
          
          this.errorTimeout = setTimeout(() => {
            this.error = '';
            this.cdr.markForCheck();
          }, 5000);
        }
      });
      };
  

  ngOnDestroy(): void {
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}