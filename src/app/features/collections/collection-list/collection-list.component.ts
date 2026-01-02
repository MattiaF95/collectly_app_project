import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { CollectionService } from '../../../core/services/collection.service';
import {
  Collection,
  COLLECTION_TYPES,
} from '../../../core/models/collection.model';
import { CreateCollectionDialogComponent } from '../../../shared/components/collection-choice-dialog/collection-choice-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';

@Component({
  selector: 'app-collection-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatMenuModule,
  ],
  template: `
    <div class="collections-container">
      <div class="header">
        <h1>Le Mie Collezioni</h1>
        <button mat-raised-button color="primary" (click)="createCollection()">
          <mat-icon>add</mat-icon>
          Nuova Collezione
        </button>
      </div>

      <div class="collections-grid" *ngIf="collections.length > 0">
        <mat-card
          *ngFor="let collection of collections"
          class="collection-card"
          (click)="openCollection(collection._id!)"
        >
          <div class="card-header" [style.background-color]="collection.color">
            <div class="type-badge">
              <mat-icon>{{ getTypeIcon(collection.type) }}</mat-icon>
              {{ getTypeLabel(collection.type) }}
            </div>
            <button
              mat-icon-button
              [matMenuTriggerFor]="menu"
              (click)="$event.stopPropagation()"
            >
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #menu="matMenu">
              <button
                mat-menu-item
                (click)="toggleCollectionFavorite(collection)"
                *ngIf="collection.isFavorite || canAddFavorite()"
              >
                <mat-icon>{{
                  collection.isFavorite ? 'favorite' : 'favorite_border'
                }}</mat-icon>
                <span>{{
                  collection.isFavorite
                    ? 'Rimuovi dai preferiti'
                    : 'Aggiungi ai preferiti'
                }}</span>
              </button>
              <button mat-menu-item (click)="editCollection(collection)">
                <mat-icon>edit</mat-icon>
                <span>Modifica</span>
              </button>
              <button mat-menu-item (click)="deleteCollection(collection)">
                <mat-icon>delete</mat-icon>
                <span>Elimina</span>
              </button>
            </mat-menu>
          </div>

          <mat-card-content>
            <h2>
              {{ collection.name }}
              <mat-icon *ngIf="collection.isFavorite" class="favorite-heart"
                >favorite</mat-icon
              >
            </h2>
            <p *ngIf="collection.subtitle">{{ collection.subtitle }}</p>

            <div class="stats">
              <div class="stat">
                <mat-icon>inventory_2</mat-icon>
                <span>{{ collection.itemCount || 0 }} oggetti</span>
              </div>
              <div class="stat" *ngIf="collection.totalValue">
                <mat-icon>euro</mat-icon>
                <span>€{{ collection.totalValue.toFixed(2) }}</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="empty-state" *ngIf="collections.length === 0">
        <mat-icon>collections_bookmark</mat-icon>
        <h2>Nessuna Collezione</h2>
        <p>Crea la tua prima collezione per iniziare</p>
        <button mat-raised-button color="primary" (click)="createCollection()">
          <mat-icon>add</mat-icon>
          Crea Collezione
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .collections-container {
        padding: 2rem;
        max-width: 1400px;
        margin: 0 auto;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;

        h1 {
          color: #2c3e50;
          margin: 0;
        }

        button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
      }

      .collections-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 1.5rem;

        .collection-card {
          cursor: pointer;
          transition: all 0.3s ease;
          overflow: hidden;

          &:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
          }

          .card-header {
            padding: 1rem 1.5rem;
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .type-badge {
              display: flex;
              align-items: center;
              gap: 0.5rem;
              font-size: 0.9rem;
              font-weight: 500;

              mat-icon {
                font-size: 20px;
                width: 20px;
                height: 20px;
              }
            }

            button {
              color: white;
            }
          }

          mat-card-content {
            padding: 1.5rem;

            h2 {
              color: #2c3e50;
              margin: 0 0 0.5rem 0;
              font-size: 1.5rem;
              display: flex;
              align-items: center;
              justify-content: space-between;

              .favorite-heart {
                color: #e74c3c;
                font-size: 20px;
                width: 20px;
                height: 20px;
              }
            }

            p {
              color: #666;
              margin: 0 0 1rem 0;
            }

            .stats {
              display: flex;
              gap: 1.5rem;

              .stat {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                color: #666;

                mat-icon {
                  font-size: 20px;
                  width: 20px;
                  height: 20px;
                  color: #3498db;
                }
              }
            }
          }
        }
      }

      .empty-state {
        text-align: center;
        padding: 4rem 2rem;

        mat-icon {
          font-size: 80px;
          width: 80px;
          height: 80px;
          color: #ccc;
          margin-bottom: 1rem;
        }

        h2 {
          color: #666;
          margin-bottom: 0.5rem;
        }

        p {
          color: #999;
          margin-bottom: 2rem;
        }

        button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
      }
    `,
  ],
})
export class CollectionListComponent implements OnInit {
  private readonly collectionService = inject(CollectionService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  collections: Collection[] = [];

  ngOnInit() {
    this.collectionService.collections$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((collections) => {
        this.collections = collections;
      });

    this.loadCollections();
  }

  loadCollections() {
    this.collectionService.getCollections().subscribe({
      error: (error) => console.error('Errore caricamento collezioni:', error),
    });
  }

  // Verifica se è possibile aggiungere un'altra collezione ai preferiti
  canAddFavorite(): boolean {
    const favoriteCount = this.collections.filter((c) => c.isFavorite).length;
    return favoriteCount < 4;
  }

  // Toggle favorito collezione
  toggleCollectionFavorite(collection: Collection) {
    if (!collection?._id) return;

    if (!collection.isFavorite && !this.canAddFavorite()) {
      alert('Puoi avere al massimo 4 collezioni preferite.');
      return;
    }

    const updatedData: Partial<Collection> = {
      isFavorite: !collection.isFavorite,
    };

    this.collectionService
      .updateCollection(collection._id, updatedData)
      .subscribe({
        error: (error) => {
          console.error("Errore durante l'aggiornamento del favorito:", error);
          alert("Errore durante l'aggiornamento del favorito");
        },
      });
  }

  createCollection() {
    const dialogRef = this.dialog.open(CreateCollectionDialogComponent, {
      width: '600px',
      disableClose: false,
      panelClass: 'create-collection-dialog',
      restoreFocus: true, // Ripristina focus dopo chiusura
      autoFocus: 'dialog', // Focus sul dialog, non primo campo
      ariaLabel: 'Crea nuova collezione',
      role: 'dialog',
    });

    dialogRef.afterClosed().subscribe((result: boolean | undefined) => {
      if (result) {
        this.loadCollections();
      }
    });
  }

  openCollection(id: string) {
    this.router.navigate(['/collections', id]);
  }

  editCollection(collection: Collection) {
    // Aprire dialog per modificare collezione
    alert('Funzionalità in sviluppo');
  }

  deleteCollection(collection: Collection) {
    if (confirm(`Eliminare la collezione "${collection.name}"?`)) {
      this.collectionService.deleteCollection(collection._id!).subscribe({
        next: () => {
          this.loadCollections();
        },
        error: (error) => {
          console.error('Errore eliminazione:', error);
        },
      });
    }
  }

  getTypeIcon(type: string): string {
    const found = COLLECTION_TYPES.find((t) => t.value === type);
    return found?.icon || 'category';
  }

  getTypeLabel(type: string): string {
    const found = COLLECTION_TYPES.find((t) => t.value === type);
    return found?.label || type;
  }
}
