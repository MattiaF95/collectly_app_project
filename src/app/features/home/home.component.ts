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

  totalCollections = 0;
  totalItems = 0;
  totalFavorites = 0;
  totalValue = 0;
  recentCollections: Collection[] = [];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.collectionService.getCollections().subscribe({
      next: (collections) => {
        this.totalCollections = collections.length;
        this.totalItems = collections.reduce(
          (sum, c) => sum + (c.itemCount || 0),
          0
        );
        this.totalValue = collections.reduce(
          (sum, c) => sum + (c.totalValue || 0),
          0
        );
        this.recentCollections = collections.slice(0, 4);
      },
      error: (error) => {
        console.error('Errore caricamento dati:', error);
      },
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
