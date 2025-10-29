import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CollectionService } from '../../../core/services/collection.service';
import {
  CollectibleService,
  Collectible,
} from '../../../core/services/collectible.service';
import { Collection } from '../../../core/models/collection.model';
import { AddCollectibleDialogComponent } from '../../../shared/components/add-collectible-dialog/add-collectible-dialog.component';
import { BarcodeScannerComponent } from '../../../shared/components/barcode-scanner/barcode-scanner.component';

@Component({
  selector: 'app-collection-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './collection-detail.component.html',
  styleUrl: './collection-detail.component.scss',
})
export class CollectionDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly collectionService = inject(CollectionService);
  private readonly collectibleService = inject(CollectibleService);
  private readonly dialog = inject(MatDialog);

  collection: Collection | null = null;
  collectibles: Collectible[] = [];
  loading = false;
  loadingCollectibles = false;

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.loadCollection(id);
    this.loadCollectibles(id);
  }

  // Carica dati collezione
  loadCollection(id: string) {
    this.loading = true;
    this.collectionService.getCollectionById(id).subscribe({
      next: (collection) => {
        this.collection = collection;
        this.loading = false;
      },
      error: (error) => {
        console.error('Errore caricamento collezione:', error);
        this.loading = false;
        this.router.navigate(['/collections']);
      },
    });
  }

  // Carica collectibles della collezione
  loadCollectibles(collectionId: string) {
    this.loadingCollectibles = true;
    this.collectibleService.getCollectibles(collectionId).subscribe({
      next: (collectibles) => {
        this.collectibles = collectibles;
        this.loadingCollectibles = false;
      },
      error: (error) => {
        console.error('Errore caricamento collectibles:', error);
        this.loadingCollectibles = false;
      },
    });
  }

  // Apre dialog per aggiungere oggetto
  openAddCollectibleDialog() {
    if (!this.collection) return;

    const dialogRef = this.dialog.open(AddCollectibleDialogComponent, {
      // Mobile-first sizing
      maxWidth: '95vw',
      width: '600px',
      maxHeight: '90vh',

      // Styling
      panelClass: 'mobile-dialog',

      // Accessibility & Focus (✅ FIX WARNING)
      disableClose: false,
      autoFocus: 'dialog', // ✅ Focus sul dialog (non primo input)
      restoreFocus: true, // ✅ Ripristina focus alla chiusura

      // ARIA labels
      ariaLabel: 'Aggiungi oggetto alla collezione', // ✅ Accessibilità
      role: 'dialog', // ✅ Ruolo ARIA corretto

      // Data
      data: {
        collectionId: this.collection._id,
        collectionType: this.collection.type,
        collectionName: this.collection.name,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.loadCollection(this.collection!._id!);
        this.loadCollectibles(this.collection!._id!);
      }
    });
  }

  // Apre barcode scanner standalone
  openBarcodeScanner() {
    const dialogRef = this.dialog.open(BarcodeScannerComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((barcode) => {
      if (barcode) {
        // Qui puoi fare qualcosa con il barcode
        // Per esempio, cercare un collectible o aprire il form pre-compilato
        console.log('Barcode scansionato:', barcode);

        // Opzione: Apri dialog con barcode pre-compilato
        const dialogRef = this.dialog.open(AddCollectibleDialogComponent, {
          width: '700px',
          maxHeight: '90vh',
          disableClose: false,
          data: {
            collectionId: this.collection!._id,
            collectionType: this.collection!.type,
            collectionName: this.collection!.name,
            barcode: barcode, // ← Pre-compila barcode
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result === true) {
            this.loadCollection(this.collection!._id!);
            this.loadCollectibles(this.collection!._id!);
          }
        });
      }
    });
  }

  // Toggle favorito
  toggleFavorite(collectible: Collectible) {
    if (!collectible._id) return;

    this.collectibleService.toggleFavorite(collectible._id).subscribe({
      next: (updated) => {
        // Aggiorna nella lista locale
        const index = this.collectibles.findIndex(
          (c) => c._id === collectible._id
        );
        if (index !== -1) {
          this.collectibles[index].isFavorite = updated.isFavorite;
        }
      },
      error: (error) => {
        console.error('Errore toggle favorite:', error);
        alert("Errore durante l'aggiornamento del favorito");
      },
    });
  }

  // Elimina collectible
  deleteCollectible(collectible: Collectible) {
    if (!collectible._id) return;

    const title = this.getCollectibleTitle(collectible);
    if (!confirm(`Eliminare "${title}"?`)) {
      return;
    }

    this.collectibleService.deleteCollectible(collectible._id).subscribe({
      next: () => {
        // Rimuovi dalla lista locale
        this.collectibles = this.collectibles.filter(
          (c) => c._id !== collectible._id
        );

        // Ricarica collezione per aggiornare contatori
        this.loadCollection(this.collection!._id!);
      },
      error: (error) => {
        console.error('Errore eliminazione:', error);
        alert("Errore durante l'eliminazione dell'oggetto");
      },
    });
  }

  // Restituisce il titolo/nome dell'oggetto
  getCollectibleTitle(collectible: Collectible): string {
    return collectible.title || collectible.name || 'Senza titolo';
  }

  // Verifica se un campo è presente e valorizzato
  hasField(collectible: Collectible, field: string): boolean {
    const value = (collectible as any)[field];

    if (value === undefined || value === null || value === '') {
      return false;
    }

    if (Array.isArray(value) && value.length === 0) {
      return false;
    }

    return true;
  }

  // Formatta il valore di un campo per visualizzazione
  formatFieldValue(collectible: Collectible, field: string): string {
    const value = (collectible as any)[field];

    if (Array.isArray(value)) {
      return value.join(', ');
    }

    if (typeof value === 'number') {
      return value.toString();
    }

    return value;
  }

  // Naviga indietro
  goBack() {
    this.router.navigate(['/collections']);
  }
}
