import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialog } from '@angular/material/dialog';
import { CollectionService } from '../../core/services/collection.service';
import { Collection } from '../../core/models/collection.model';
import { CreateCollectionDialogComponent } from '../../shared/components/collection-choice-dialog/collection-choice-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
  ],

  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private collectionService = inject(CollectionService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);

  favoriteCollections: Collection[] = [];

  ngOnInit() {
    this.collectionService.collections$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((collections) => {
        this.favoriteCollections = collections
          .filter((c) => c.isFavorite)
          .slice(0, 4);
      });

    this.collectionService.getCollections().subscribe({
      error: (error) => console.error('Errore caricamento dati:', error),
    });
  }

  openCreateCollectionDialog() {
    this.dialog.open(CreateCollectionDialogComponent, {
      width: '600px',
      disableClose: false,
      panelClass: 'create-collection-dialog',
    });
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
