
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ServiceAuth } from '../../service/service-auth';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})

export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  error: boolean = false;
  isLoading = false;
  private fb: FormBuilder = inject(FormBuilder);
  private  authService: ServiceAuth =inject(ServiceAuth)
   private router: Router=inject(Router);
   

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    
    this.isLoading = true;
    this.error = false;

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        console.log('Login successful', res);
        localStorage.setItem('token', res.Token);
        this.loginForm.reset();
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Login failed', err?.error);
        this.error = true;
        setTimeout(() => {
          this.error = false;
        }, 5000);
      }
    });
  }
}