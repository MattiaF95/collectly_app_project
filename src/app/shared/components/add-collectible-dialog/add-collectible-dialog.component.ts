import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { CollectibleService } from '../../../core/services/collectible.service';
import { CollectionType } from '../../../core/models/collection.model';
import { FormInputComponent } from '../form-input/form-input.component';
import {
  FormSelectComponent,
  SelectOption,
} from '../form-select/form-select.component';
import { FormTextareaComponent } from '../form-textarea/form-textarea.component';
import { FormImageUploadComponent } from '../form-image-upload/form-image-upload.component';
import { BarcodeScannerComponent } from '../barcode-scanner/barcode-scanner.component';

export interface AddCollectibleDialogData {
  collectionId: string;
  collectionType: CollectionType;
  collectionName: string;
}

@Component({
  selector: 'app-add-collectible-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    FormInputComponent,
    FormSelectComponent,
    FormTextareaComponent,
    FormImageUploadComponent,
  ],
  templateUrl: './add-collectible-dialog.component.html',
  styleUrl: './add-collectible-dialog.component.scss',
})
export class AddCollectibleDialogComponent {
  private dialogRef = inject(MatDialogRef<AddCollectibleDialogComponent>);
  private collectibleService = inject(CollectibleService);
  private dialog = inject(MatDialog);

  collectionId: string;
  collectionType: CollectionType;
  collectionName: string;

  creating = false;
  confirmed = false;

  // Form data
  formData: any = {};

  // Opzioni per i select
  itemTypeOptions: SelectOption[] = [
    { value: 'movie', label: 'Film' },
    { value: 'series', label: 'Serie TV' },
  ];

  conditionOptions: SelectOption[] = [
    { value: 'mint', label: 'Mint' },
    { value: 'near_mint', label: 'Near Mint' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' },
  ];

  formatOptions: SelectOption[] = [
    { value: 'bluray', label: 'Blu-ray' },
    { value: 'dvd', label: 'DVD' },
    { value: '4k', label: '4K Ultra HD' },
    { value: 'digital', label: 'Digital' },
  ];

  comicFormatOptions: SelectOption[] = [
    { value: 'stapled', label: 'Spillato' },
    { value: 'hardcover', label: 'Cartonato' },
    { value: 'paperback', label: 'Brossurato' },
    { value: 'omnibus', label: 'Omnibus' },
    { value: 'tankobon', label: 'Tankobon' },
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: AddCollectibleDialogData) {
    this.collectionId = data.collectionId;
    this.collectionType = data.collectionType;
    this.collectionName = data.collectionName;
    this.initFormData();
  }

  initFormData() {
    switch (this.collectionType) {
      case 'movies':
        this.formData = {
          title: '',
          itemType: 'movie',
          releaseYear: null,
          director: '',
          genres: [],
          format: [],
          duration: null,
          barcode: '',
          purchasePrice: null,
          estimatedValue: null,
          images: [],
          personalNotes: '',
        };
        break;

      case 'comics':
        this.formData = {
          title: '',
          issueNumber: null,
          series: '',
          publisher: '',
          publicationYear: null,
          authors: [],
          format: '',
          condition: '',
          barcode: '',
          purchasePrice: null,
          estimatedValue: null,
          images: [],
          personalNotes: '',
        };
        break;

      case 'statues':
        this.formData = {
          name: '',
          character: '',
          series: '',
          manufacturer: '',
          scale: '',
          height: null,
          condition: '',
          purchasePrice: null,
          estimatedValue: null,
          images: [],
          personalNotes: '',
        };
        break;

      case 'stamps':
        this.formData = {
          name: '',
          country: '',
          issueYear: null,
          faceValue: null,
          condition: '',
          purchasePrice: null,
          estimatedValue: null,
          images: [],
          personalNotes: '',
        };
        break;

      case 'books':
        this.formData = {
          title: '',
          author: '',
          publisher: '',
          publicationYear: null,
          isbn: '',
          condition: '',
          purchasePrice: null,
          estimatedValue: null,
          images: [],
          personalNotes: '',
        };
        break;

      case 'magazines':
        this.formData = {
          title: '',
          issueNumber: null,
          series: '',
          publisher: '',
          publicationDate: null,
          condition: '',
          purchasePrice: null,
          estimatedValue: null,
          images: [],
          personalNotes: '',
        };
        break;
    }
  }

  isFormValid(): boolean {
    switch (this.collectionType) {
      case 'movies':
        return !!this.formData.title && !!this.formData.itemType;
      case 'comics':
      case 'books':
      case 'magazines':
        return !!this.formData.title;
      case 'statues':
      case 'stamps':
        return !!this.formData.name;
      default:
        return false;
    }
  }

  openBarcodeScanner() {
    const dialogRef = this.dialog.open(BarcodeScannerComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.formData.barcode = result;
      }
    });
  }

  addCollectible() {
    if (!this.isFormValid()) return;

    this.creating = true;

    this.collectibleService
      .createCollectible(this.collectionId, this.formData)
      .subscribe({
        next: () => {
          this.creating = false;
          this.confirmed = true;

          setTimeout(() => {
            this.dialogRef.close(true);
          }, 1000);
        },
        error: (error) => {
          console.error('Errore creazione collectible:', error);
          this.creating = false;
          alert("Errore durante l'aggiunta dell'oggetto");
        },
      });
  }

  close() {
    this.dialogRef.close(false);
  }
}
