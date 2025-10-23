import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { CollectionService } from '../../../core/services/collection.service';
import {
  COLLECTION_TYPES,
  CollectionType,
  CollectionTypeOption,
} from '../../../core/models/collection.model';

@Component({
  selector: 'app-create-collection-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './collection-choice-dialog.component.html',
  styleUrl: './collection-choice-dialog.component.scss',
})
export class CreateCollectionDialogComponent {
  private dialogRef = inject(MatDialogRef<CreateCollectionDialogComponent>);
  private collectionService = inject(CollectionService);
  private router = inject(Router);

  collectionTypes: CollectionTypeOption[] = COLLECTION_TYPES;
  selectedType: CollectionType | null = null;
  creating = false;
  confirmed = false;
  createdCollectionId: string | null = null;

  selectType(type: CollectionType) {
    this.selectedType = type;
  }

  createCollection() {
    if (!this.selectedType) return;

    this.creating = true;

    // Determina nome default in base al tipo
    const typeLabel =
      this.collectionTypes.find((t) => t.value === this.selectedType)?.label ||
      'Nuova Collezione';

    const newCollection = {
      type: this.selectedType,
      name: `${typeLabel}`,
      color: this.getColorForType(this.selectedType),
    };

    this.collectionService.createCollection(newCollection).subscribe({
      next: (collection) => {
        this.createdCollectionId = collection._id!;
        this.creating = false;
        this.confirmed = true;

        // Dopo 1 secondo, chiudi dialog e vai alla collezione
        setTimeout(() => {
          this.dialogRef.close();
          this.router.navigate(['/collections', this.createdCollectionId]);
        }, 1000);
      },
      error: (error) => {
        console.error('Errore creazione collezione:', error);
        this.creating = false;
        alert('Errore durante la creazione della collezione');
      },
    });
  }

  getColorForType(type: CollectionType): string {
    const colors: Record<CollectionType, string> = {
      movies: '#3498db',
      statues: '#9b59b6',
      stamps: '#e67e22',
      comics: '#e74c3c',
      books: '#2ecc71',
      magazines: '#f39c12',
    };
    return colors[type] || '#3498db';
  }

  close() {
    this.dialogRef.close();
  }
}
