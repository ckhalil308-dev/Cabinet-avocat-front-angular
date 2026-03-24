import { Component, OnInit, OnDestroy, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  ReactiveFormsModule, 
  FormBuilder, 
  FormGroup, 
  Validators,
  AbstractControl,
  ValidationErrors 
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, timeout } from 'rxjs/operators';
import { ClientRegister } from '../../interfaces/client-register';
import { ServiceAuth } from '../../service/service-auth';
import { ErrorInterface } from '../../interfaces/error';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Register implements OnInit, OnDestroy {
  registerForm!: FormGroup;
  isLoading = false;
  error: string = '';
  success: string = '';

  private fb = inject(FormBuilder);
  private authService = inject(ServiceAuth);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();
  private errorTimeout: any;

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      numTelephone: ['', Validators.required],
      motDePasse: ['', [Validators.required, Validators.minLength(6)]],
      confirmerMotDePasse: ['', Validators.required]
    }, { 
      validators: this.passwordMatchValidator 
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const motDePasse = control.get('motDePasse');
    const confirmerMotDePasse = control.get('confirmerMotDePasse');

    if (!motDePasse || !confirmerMotDePasse) {
      return null;
    }

    return motDePasse.value === confirmerMotDePasse.value 
      ? null 
      : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.error = '';
    this.success = '';
    this.cdr.markForCheck();
    const formValue = this.registerForm.value;
    const registerData: ClientRegister = {
      prenom: formValue.prenom,
      nom: formValue.nom,
      email: formValue.email,
      numTelephone: formValue.numTelephone,
      password: formValue.motDePasse  
    };

    this.authService.register(registerData)
      .pipe(
        timeout(10000),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          this.success = 'Inscription réussie! Redirection vers la connexion...';
          this.cdr.markForCheck();
          
         
          this.registerForm.reset();
          
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (err: any) => {
          console.error('Registration failed:', err);
          
          this.isLoading = false;
          

          if (this.errorTimeout) {
            clearTimeout(this.errorTimeout);
          }

          if (err.name === 'TimeoutError') {
            this.error = 'La connexion a dépassé le délai imparti. Veuillez réessayer.';
          } else {
            const errorResponse:  ErrorInterface = err?.error;
            
            this.error = errorResponse?.message || 
              err?.message || 
              err?.statusText || 
              'une erreur est survenue lors de l\'inscription';
          }

          this.cdr.markForCheck();
          this.errorTimeout = setTimeout(() => {
            this.error = '';
            this.cdr.markForCheck();
          }, 5000);
        }
      });
  }

  ngOnDestroy(): void {
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}