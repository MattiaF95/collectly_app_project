// src/app/features/auth/login/login.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpErrorResponse } from '@angular/common/http'; // Importa per la gestione degli errori

import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model'; // ✅ L'import va qui, all'inizio del file

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, // ✅ Ora l'array `imports` è corretto
    FormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>collections_bookmark</mat-icon>
            Collectly
          </mat-card-title>
          <mat-card-subtitle>Accedi al tuo account</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input
                matInput
                type="email"
                [(ngModel)]="credentials.email"
                name="email"
                required
                email
              />
              <mat-icon matPrefix>email</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input
                matInput
                [type]="hidePassword ? 'password' : 'text'"
                [(ngModel)]="credentials.password"
                name="password"
                required
                minlength="6"
              />
              <mat-icon matPrefix>lock</mat-icon>
              <button
                mat-icon-button
                matSuffix
                (click)="hidePassword = !hidePassword"
                type="button"
              >
                <mat-icon>{{
                  hidePassword ? 'visibility_off' : 'visibility'
                }}</mat-icon>
              </button>
            </mat-form-field>

            <div class="error-message" *ngIf="errorMessage">
              {{ errorMessage }}
            </div>

            <button
              mat-raised-button
              color="primary"
              type="submit"
              class="full-width"
              [disabled]="loading || !loginForm.valid"
            >
              <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
              <span *ngIf="!loading">Accedi</span>
            </button>
          </form>
        </mat-card-content>

        <mat-card-actions>
          <p>Non hai un account? <a routerLink="/register">Registrati</a></p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .login-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 1rem;
      }

      .login-card {
        width: 100%;
        max-width: 400px;
        border-radius: 12px;

        mat-card-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem 0 1rem;
          border-bottom: 1px solid #eee;

          mat-card-title {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 2rem;
            color: #3f51b5; // Colore primario del tema

            mat-icon {
              font-size: 2rem;
              width: 2rem;
              height: 2rem;
            }
          }

          mat-card-subtitle {
            margin-top: 0.5rem;
            color: #666;
          }
        }

        mat-card-content {
          padding: 2rem;

          form {
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
          }

          .full-width {
            width: 100%;
          }

          .error-message {
            color: #f44336;
            font-size: 14px;
            margin: -0.5rem 0 0.5rem;
            text-align: center;
            font-weight: 500;
          }
        }

        mat-card-actions {
          padding: 0 2rem 2rem;
          text-align: center;

          p {
            margin: 0;
            color: #666;

            a {
              color: #3f51b5; // Colore primario
              text-decoration: none;
              font-weight: 500;

              &:hover {
                text-decoration: underline;
              }
            }
          }
        }
      }
    `,
  ],
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  credentials = {
    email: '',
    password: '',
  };

  hidePassword = true;
  loading = false;
  errorMessage = '';

  onSubmit() {
    if (!this.credentials.email || !this.credentials.password) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService
      .login({
        email: this.credentials.email,
        password: this.credentials.password,
      })
      .subscribe({
        next: (user: User) => {
          // Tipizza il parametro
          console.log('Login riuscito:', user);
          this.router.navigate(['/']);
          this.loading = false;
        },
        error: (error: HttpErrorResponse) => {
          // Tipizza l'errore
          console.error('Errore login:', error);
          this.errorMessage =
            error.error?.message ||
            'Credenziali non valide o errore del server.';
          this.loading = false;
        },
      });
  }
}
