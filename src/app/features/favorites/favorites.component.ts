import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="favorites-container">
      <h1>Oggetti Preferiti</h1>
      <div class="empty-state">
        <mat-icon>favorite_border</mat-icon>
        <p>Nessun oggetto nei preferiti</p>
      </div>
    </div>
  `,
  styles: [
    `
      .favorites-container {
        padding: 2rem;
        max-width: 1400px;
        margin: 0 auto;

        h1 {
          color: #2c3e50;
          margin-bottom: 2rem;
        }

        .empty-state {
          text-align: center;
          padding: 4rem;

          mat-icon {
            font-size: 80px;
            width: 80px;
            height: 80px;
            color: #ccc;
          }

          p {
            color: #999;
            margin-top: 1rem;
          }
        }
      }
    `,
  ],
})
export class FavoritesComponent {}
