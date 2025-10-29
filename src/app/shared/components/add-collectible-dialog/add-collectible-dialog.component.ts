import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
  barcode?: string;
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
    MatCheckboxModule,
  ],
  templateUrl: './add-collectible-dialog.component.html',
  styleUrl: './add-collectible-dialog.component.scss',
})
export class AddCollectibleDialogComponent {
  private readonly dialogRef = inject(
    MatDialogRef<AddCollectibleDialogComponent>
  );
  private readonly collectibleService = inject(CollectibleService);
  private readonly dialog = inject(MatDialog);

  collectionId: string;
  collectionType: CollectionType;
  collectionName: string;

  creating = false;
  confirmed = false;

  // Form data
  formData: any = {};

  // ========================================
  // OPZIONI PER SELECT - FILM E SERIE TV
  // ========================================
  itemTypeOptions: SelectOption[] = [
    { value: 'movie', label: 'Film' },
    { value: 'series', label: 'Serie TV' },
  ];

  genreOptions: SelectOption[] = [
    { value: 'action', label: 'Azione' },
    { value: 'thriller', label: 'Thriller' },
    { value: 'sci_fi', label: 'Fantascienza' },
    { value: 'drama', label: 'Dramma' },
    { value: 'comedy', label: 'Commedia' },
    { value: 'horror', label: 'Horror' },
  ];

  formatOptions: SelectOption[] = [
    { value: 'bluray', label: 'Blu-ray' },
    { value: '4k', label: '4K Ultra HD' },
    { value: 'dvd', label: 'DVD' },
    { value: 'laserdisc', label: 'Laserdisc' },
    { value: 'digital', label: 'Digital' },
  ];

  audioCodecOptions: SelectOption[] = [
    { value: 'dolby_digital', label: 'Dolby Digital' },
    { value: 'dts_hd', label: 'DTS-HD' },
    { value: 'aac', label: 'AAC' },
    { value: 'flac', label: 'FLAC' },
  ];

  audioFormatOptions: SelectOption[] = [
    { value: '2.0', label: '2.0' },
    { value: '5.1', label: '5.1' },
    { value: '7.1', label: '7.1' },
    { value: 'mono', label: 'Mono' },
  ];

  audioLanguageOptions: SelectOption[] = [
    { value: 'italian', label: 'Italiano' },
    { value: 'english', label: 'Inglese' },
    { value: 'french', label: 'Francese' },
    { value: 'spanish', label: 'Spagnolo' },
    { value: 'german', label: 'Tedesco' },
  ];

  subtitleOptions: SelectOption[] = [
    { value: 'italian', label: 'Italiano' },
    { value: 'english', label: 'Inglese' },
    { value: 'french', label: 'Francese' },
    { value: 'spanish', label: 'Spagnolo' },
  ];

  specialEditionOptions: SelectOption[] = [
    { value: 'steelbook', label: 'Steelbook' },
    { value: 'collector', label: "Collector's Edition" },
    { value: 'amaray', label: 'Amaray' },
    { value: 'uce', label: 'UCE' },
    { value: 'fullslip', label: 'Fullslip' },
    { value: 'lenticular', label: 'Lenticolare' },
    { value: 'box', label: 'Box' },
    { value: 'one_click', label: 'One-click' },
  ];

  movieStatusOptions: SelectOption[] = [
    { value: 'to_watch', label: 'Da vedere' },
    { value: 'watching', label: 'In corso' },
    { value: 'completed', label: 'Conclusa' },
  ];

  // ========================================
  // OPZIONI PER SELECT - STATUE
  // ========================================
  scaleOptions: SelectOption[] = [
    { value: '1/2', label: '1/2' },
    { value: '1/4', label: '1/4' },
    { value: '1/6', label: '1/6' },
    { value: '1/10', label: '1/10' },
    { value: 'life_size', label: 'Life Size' },
  ];

  materialOptions: SelectOption[] = [
    { value: 'resin', label: 'Resina' },
    { value: 'pvc', label: 'PVC' },
    { value: 'metal', label: 'Metallo' },
    { value: 'polystone', label: 'Polystone' },
  ];

  statueStatusOptions: SelectOption[] = [
    { value: 'new', label: 'Nuovo' },
    { value: 'used', label: 'Usato' },
    { value: 'damaged', label: 'Danneggiato' },
    { value: 'missing_parts', label: 'Parti mancanti' },
  ];

  packagingOptions: SelectOption[] = [
    { value: 'with_box', label: 'Con scatola originale' },
    { value: 'without_box', label: 'Senza scatola originale' },
  ];

  // ========================================
  // OPZIONI PER SELECT - FRANCOBOLLI
  // ========================================
  countryOptions: SelectOption[] = [
    { value: 'italy', label: 'Italia' },
    { value: 'france', label: 'Francia' },
    { value: 'usa', label: 'USA' },
    { value: 'germany', label: 'Germania' },
    { value: 'spain', label: 'Spagna' },
  ];

  currencyOptions: SelectOption[] = [
    { value: 'lira', label: 'Lira' },
    { value: 'euro', label: 'Euro' },
    { value: 'dollar', label: 'Dollaro' },
    { value: 'pound', label: 'Sterlina' },
  ];

  colorOptions: SelectOption[] = [
    { value: 'red', label: 'Rosso' },
    { value: 'blue', label: 'Blu' },
    { value: 'green', label: 'Verde' },
    { value: 'yellow', label: 'Giallo' },
    { value: 'black', label: 'Nero' },
  ];

  stampConditionOptions: SelectOption[] = [
    { value: 'new', label: 'Nuovo' },
    { value: 'used', label: 'Usato' },
    { value: 'no_gum', label: 'Senza gomma' },
  ];

  printTypeOptions: SelectOption[] = [
    { value: 'calcography', label: 'Calcografia' },
    { value: 'lithography', label: 'Litografia' },
    { value: 'offset', label: 'Offset' },
  ];

  gumOptions: SelectOption[] = [
    { value: 'full', label: 'Integra' },
    { value: 'partial', label: 'Parziale' },
    { value: 'absent', label: 'Assente' },
  ];

  varietiesOptions: SelectOption[] = [
    { value: 'print_error', label: 'Errore di stampa' },
    { value: 'rare_color', label: 'Colore raro' },
    { value: 'missing_perforation', label: 'Dentellatura mancante' },
  ];

  // ========================================
  // OPZIONI PER SELECT - FUMETTI
  // ========================================
  comicFormatOptions: SelectOption[] = [
    { value: 'stapled', label: 'Spillato' },
    { value: 'hardcover', label: 'Cartonato' },
    { value: 'paperback', label: 'Brossurato' },
    { value: 'omnibus', label: 'Omnibus' },
    { value: 'tankobon', label: 'Tankobon' },
  ];

  comicGenreOptions: SelectOption[] = [
    { value: 'superhero', label: 'Supereroi' },
    { value: 'western', label: 'Western' },
    { value: 'manga', label: 'Manga' },
    { value: 'fantasy', label: 'Fantasy' },
    { value: 'horror', label: 'Horror' },
  ];

  comicLanguageOptions: SelectOption[] = [
    { value: 'italian', label: 'Italiano' },
    { value: 'english', label: 'Inglese' },
    { value: 'japanese', label: 'Giapponese' },
    { value: 'french', label: 'Francese' },
  ];

  comicStatusOptions: SelectOption[] = [
    { value: 'read', label: 'Letto' },
    { value: 'to_read', label: 'Da leggere' },
    { value: 'reading', label: 'In corso' },
  ];

  conditionOptions: SelectOption[] = [
    { value: 'mint', label: 'Mint' },
    { value: 'near_mint', label: 'Near Mint' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' },
  ];

  // ========================================
  // OPZIONI PER SELECT - LIBRI
  // ========================================
  bookFormatOptions: SelectOption[] = [
    { value: 'hardcover', label: 'Copertina rigida' },
    { value: 'paperback', label: 'Brossura' },
    { value: 'pocket', label: 'Tascabile' },
    { value: 'boxset', label: 'Cofanetto' },
  ];

  bookLanguageOptions: SelectOption[] = [
    { value: 'italian', label: 'Italiano' },
    { value: 'english', label: 'Inglese' },
    { value: 'french', label: 'Francese' },
    { value: 'spanish', label: 'Spagnolo' },
  ];

  bookGenreOptions: SelectOption[] = [
    { value: 'fantasy', label: 'Fantasy' },
    { value: 'adventure', label: 'Avventura' },
    { value: 'dystopia', label: 'Distopia' },
    { value: 'sci_fi', label: 'Fantascienza' },
    { value: 'mystery', label: 'Mistero' },
    { value: 'historical', label: 'Storico' },
  ];

  bookReadingStatusOptions: SelectOption[] = [
    { value: 'read', label: 'Letto' },
    { value: 'to_read', label: 'Da leggere' },
    { value: 'reading', label: 'In corso' },
    { value: 'abandoned', label: 'Abbandonato' },
  ];

  bookConditionOptions: SelectOption[] = [
    { value: 'new', label: 'Nuovo' },
    { value: 'like_new', label: 'Come nuovo' },
    { value: 'good', label: 'Buono' },
    { value: 'fair', label: 'Discreto' },
    { value: 'worn', label: 'Usurato' },
  ];

  // ========================================
  // OPZIONI PER SELECT - PERIODICI
  // ========================================
  periodicalConditionOptions: SelectOption[] = [
    { value: 'new_sealed', label: 'Nuovo sigillato' },
    { value: 'new_opened', label: 'Nuovo aperto' },
    { value: 'good', label: 'Buono' },
    { value: 'damaged', label: 'Danneggiato' },
  ];

  seriesStatusOptions: SelectOption[] = [
    { value: 'ongoing', label: 'In corso' },
    { value: 'complete', label: 'Completa' },
    { value: 'abandoned', label: 'Abbandonata' },
    { value: 'waiting', label: 'In attesa di nuove uscite' },
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: AddCollectibleDialogData) {
    this.collectionId = data.collectionId;
    this.collectionType = data.collectionType;
    this.collectionName = data.collectionName;
    this.initFormData();

    // ✅ Pre-compila barcode se fornito
    if (data.barcode) {
      this.formData.barcode = data.barcode;
    }
  }

  initFormData() {
    switch (this.collectionType) {
      case 'movies':
        this.formData = {
          // Required fields
          title: '',
          itemType: 'movie',
          format: [],
          barcode: '',
          coverImage: [],

          // Optional fields
          releaseYear: null,
          genres: [],
          director: '',
          actors: [],
          audioLanguages: [],
          subtitles: [],
          duration: null,
          seasons: null,
          episodes: null,
          estimatedValue: null,
          purchasePrice: null,
          specialEdition: [],
          personalNotes: '',
          status: '',
          isFavorite: false,
          addedDate: new Date().toISOString(),
        };
        break;

      case 'comics':
        this.formData = {
          // Required fields
          title: '',
          issueNumber: null,
          series: '',
          publisher: '',
          barcode: '',

          // Optional fields
          publicationYear: null,
          language: '',
          authors: [],
          genres: [],
          comicFormat: '',
          estimatedValue: null,
          purchasePrice: null,
          status: '',
          condition: '',
          coverImage: [],
          personalNotes: '',
          isFavorite: false,
          addedDate: new Date().toISOString(),
        };
        break;

      case 'statues':
        this.formData = {
          // Required fields
          name: '',
          character: '',
          series: '',
          manufacturer: '',
          category: '',
          scale: '',

          // Optional fields
          limitedEdition: false,
          editionNumber: null,
          editionTotal: null,
          barcode: '',
          height: null,
          width: null,
          depth: null,
          releaseYear: null,
          materials: [],
          estimatedValue: null,
          purchasePrice: null,
          status: '',
          packaging: '',
          purchaseLocation: '',
          images: [],
          personalNotes: '',
          isFavorite: false,
          addedDate: new Date().toISOString(),
        };
        break;

      case 'stamps':
        this.formData = {
          // Required fields
          name: '',
          country: '',
          issueYear: null,
          faceValue: null,
          currency: '',
          series: '',
          stampCondition: '',
          height: null,
          width: null,

          // Optional fields
          catalogNumber: '',
          colors: [],
          theme: '',
          perforation: '',
          printType: '',
          paper: '',
          watermark: '',
          gum: [],
          cancellation: '',
          varieties: [],
          certificate: '',
          estimatedValue: null,
          purchasePrice: null,
          provenance: '',
          images: [],
          personalNotes: '',
          isFavorite: false,
          addedDate: new Date().toISOString(),
        };
        break;

      case 'books':
        this.formData = {
          // Required fields
          title: '',
          authors: [],
          publisher: '',
          language: '',
          barcode: '',

          // Optional fields
          series: '',
          publicationYear: null,
          edition: '',
          genres: [],
          bookFormat: '',
          estimatedValue: null,
          purchasePrice: null,
          autographed: false,
          readingStatus: '',
          condition: '',
          images: [],
          personalNotes: '',
          isFavorite: false,
          addedDate: new Date().toISOString(),
        };
        break;

      case 'magazines':
        this.formData = {
          // Required fields
          title: '',
          category: '',
          publisher: '',
          issueNumber: null,
          totalIssues: null,
          seriesStatus: '',

          // Optional fields
          barcode: '',
          estimatedValue: null,
          purchasePrice: null,
          condition: '',
          images: [],
          personalNotes: '',
          isFavorite: false,
          addedDate: new Date().toISOString(),
        };
        break;
    }
  }

  isFormValid(): boolean {
    switch (this.collectionType) {
      case 'movies':
        return (
          !!this.formData.title &&
          !!this.formData.itemType &&
          this.formData.format.length > 0 &&
          !!this.formData.barcode &&
          this.formData.coverImage.length > 0 &&
          (this.formData.itemType !== 'series' ||
            (this.formData.seasons !== null && this.formData.episodes !== null))
        );

      case 'comics':
        return (
          !!this.formData.title &&
          this.formData.issueNumber !== null &&
          !!this.formData.series &&
          !!this.formData.publisher &&
          !!this.formData.barcode
        );

      case 'statues':
        return (
          !!this.formData.name &&
          !!this.formData.character &&
          !!this.formData.series &&
          !!this.formData.manufacturer &&
          !!this.formData.category &&
          !!this.formData.scale
        );

      case 'stamps':
        return (
          !!this.formData.name &&
          !!this.formData.country &&
          this.formData.issueYear !== null &&
          this.formData.faceValue !== null &&
          !!this.formData.currency &&
          !!this.formData.series &&
          !!this.formData.stampCondition &&
          this.formData.height !== null &&
          this.formData.width !== null
        );

      case 'books':
        return (
          !!this.formData.title &&
          this.formData.authors.length > 0 &&
          !!this.formData.publisher &&
          !!this.formData.language &&
          !!this.formData.barcode
        );

      case 'magazines':
        return (
          !!this.formData.title &&
          !!this.formData.category &&
          !!this.formData.publisher &&
          this.formData.issueNumber !== null &&
          this.formData.totalIssues !== null &&
          !!this.formData.seriesStatus
        );

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
