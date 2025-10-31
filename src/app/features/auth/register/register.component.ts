import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
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
    <div class="register-container">
      <mat-card class="register-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>collections_bookmark</mat-icon>
            Collectly
          </mat-card-title>
          <mat-card-subtitle>Crea il tuo account</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Username</mat-label>
              <input
                matInput
                type="text"
                [(ngModel)]="user.username"
                name="username"
                required
                minlength="3"
              />
              <mat-icon matPrefix>person</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input
                matInput
                type="email"
                [(ngModel)]="user.email"
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
                [(ngModel)]="user.password"
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

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Conferma Password</mat-label>
              <input
                matInput
                [type]="hideConfirmPassword ? 'password' : 'text'"
                [(ngModel)]="confirmPassword"
                name="confirmPassword"
                required
                minlength="6"
              />
              <mat-icon matPrefix>lock</mat-icon>
              <button
                mat-icon-button
                matSuffix
                (click)="hideConfirmPassword = !hideConfirmPassword"
                type="button"
              >
                <mat-icon>{{
                  hideConfirmPassword ? 'visibility_off' : 'visibility'
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
              [disabled]="loading || !registerForm.valid"
            >
              <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
              <span *ngIf="!loading">Registrati</span>
            </button>
          </form>
        </mat-card-content>

        <mat-card-actions>
          <p>Hai già un account? <a routerLink="/login">Accedi</a></p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .register-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 1rem;
      }

      .register-card {
        width: 100%;
        max-width: 450px;

        mat-card-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem 0 1rem;

          mat-card-title {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 2rem;
            color: #3498db;

            mat-icon {
              font-size: 2rem;
              width: 2rem;
              height: 2rem;
            }
          }

          mat-card-subtitle {
            margin-top: 0.5rem;
          }
        }

        mat-card-content {
          padding: 2rem;

          form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .full-width {
            width: 100%;
          }

          .error-message {
            color: #f44336;
            font-size: 14px;
            margin: -0.5rem 0 0.5rem;
            text-align: center;
          }
        }

        mat-card-actions {
          padding: 0 2rem 2rem;
          text-align: center;

          p {
            margin: 0;
            color: #666;

            a {
              color: #3498db;
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
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  user = {
    email: '',
    username: '',
    password: '',
  };

  confirmPassword = '';
  hidePassword = true;
  hideConfirmPassword = true;
  loading = false;
  errorMessage = '';

  onSubmit() {
    if (!this.user.email || !this.user.username || !this.user.password) {
      return;
    }

    if (this.user.password !== this.confirmPassword) {
      this.errorMessage = 'Le password non corrispondono';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.register(this.user).subscribe({
      next: (user) => {
        console.log('Registrazione riuscita:', user);
        this.router.navigate(['/']);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Errore di registrazione:', error.message);
      },
    });
  }
}
