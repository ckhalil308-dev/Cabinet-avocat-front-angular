import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  ReactiveFormsModule, 
  FormBuilder, 
  FormGroup, 
  Validators,
  AbstractControl,
  ValidationErrors 
} from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register implements OnInit {
  registerForm!: FormGroup;
  private fb = inject(FormBuilder);

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
    if (this.registerForm.valid) {
      console.log('Registration payload', this.registerForm.value);

    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}