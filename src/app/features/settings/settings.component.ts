import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="settings-container">
      <h1>Impostazioni</h1>

      <mat-card>
        <mat-card-header>
          <mat-card-title>Account</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Gestisci le impostazioni del tuo account</p>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-header>
          <mat-card-title>Backup e Sincronizzazione</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Funzionalità in sviluppo</p>
          <button mat-raised-button disabled>
            <mat-icon>backup</mat-icon>
            Esporta Dati
          </button>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .settings-container {
        padding: 2rem;
        max-width: 800px;
        margin: 0 auto;

        h1 {
          color: #2c3e50;
          margin-bottom: 2rem;
        }

        mat-card {
          margin-bottom: 1.5rem;

          button {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-top: 1rem;
          }
        }
      }
    `,
  ],
})
export class SettingsComponent {}
