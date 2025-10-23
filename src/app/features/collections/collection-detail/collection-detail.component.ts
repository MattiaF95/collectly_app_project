import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CollectionService } from '../../../core/services/collection.service';
import { Collection } from '../../../core/models/collection.model';
import { AddCollectibleDialogComponent } from '../../../shared/components/add-collectible-dialog/add-collectible-dialog.component';

@Component({
  selector: 'app-collection-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './collection-detail.component.html',
  styleUrl: './collection-detail.component.scss',
})
export class CollectionDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private collectionService = inject(CollectionService);
  private dialog = inject(MatDialog);

  collection: Collection | null = null;

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.loadCollection(id);
  }

  loadCollection(id: string) {
    this.collectionService.getCollectionById(id).subscribe({
      next: (collection) => {
        this.collection = collection;
      },
      error: (error) => {
        console.error('Errore caricamento collezione:', error);
        this.router.navigate(['/collections']);
      },
    });
  }

  openAddCollectibleDialog() {
    if (!this.collection) return;

    const dialogRef = this.dialog.open(AddCollectibleDialogComponent, {
      width: '700px',
      disableClose: false,
      data: {
        collectionId: this.collection._id,
        collectionType: this.collection.type,
        collectionName: this.collection.name,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        // Ricarica la collezione per aggiornare i conteggi
        this.loadCollection(this.collection!._id!);
      }
    });
  }

  goBack() {
    this.router.navigate(['/collections']);
  }
}
